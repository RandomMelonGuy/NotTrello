const express = require("express");
const app = express();
const hbs = require("hbs");
const crypto = require("crypto");
const path = require("path");
const bodyParser = require("body-parser");
const { RegisterUser, AuthUser, FindUsers, GetUser } = require("./db");
const fs = require("fs");
const session = require("express-session");
const mailer = require("nodemailer");
// gmail - teacher72522@gmail.com / pass - student72
app.use(express.text());
app.set("view engine", 'hbs');
app.set("views", "hbs_views");
app.use(session({
    secret: "VERYSECRETVARIABLE",
    resave: false,
    saveUninitialized: false,
}));
async function sendMail(val) {
    let transporter = mailer.createTransport({
            service: "gmail",
            auth: {
            user: "arbuzrar@gmail.com",
            pass: "fcadzmexhqaaohps",
    }
    });
    let message = {
        from: '"Mailer Bot" arbuzrar@gmail.com', // sender address
        to: `${val.email}`, // list of receivers
        subject: `${val.reason}`, // Subject line
        text: "Введите пароль для подтверждения почты.", // plain text body
        html: `<p>Введите пароль для подтверждения почты!</p><p>Пароль: ${val.password}</p>`,
    };
    transporter.sendMail(message).then(info=>{console.log(info)});
}
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
const genRandomString = () => {
    let alp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    alp = alp + alp.toLowerCase();
    alp = shuffle(alp.split(""));
    return (alp).slice(0,30).join("");
};
app.get("/", (req,res)=>{
    res.render("index.hbs", {...req.session});
});
app.get("/register", (req,res)=>{
    res.sendFile(path.join(__dirname,"register1.html"))
});
app.listen(3000, ()=>{
    console.log("Connected");
});
app.get("/auth", (req, res)=> {
    console.log(req.session.username);
    res.sendFile(path.join(__dirname, "auth.html"));
});
app.get("/create-project", (req, res)=>{
    res.render("create-project.hbs", {...req.session})
});
app.post("/auth", async(req, res)=>{
    const { username, password } = JSON.parse(req.body);
    const responce = (await AuthUser(username)).rows[0];
    if (responce != undefined){
        req.session.user = {username: username, email: responce.email};
        const encodedPassword = crypto.createHash("sha-1").update(password+responce.salt).digest("hex");
        if (encodedPassword === responce.password){
            //console.log("АХАХА, РЕАЛЬНО ТАКОЙ ЕСТЬ!");
            req.session.autorized = true;
            req.session.user = {username: username, email: responce.email};
            console.log(responce);
            res.status(200).send({msg: "Вы успешно авторизовались!", success: true});
        }
        else{
            res.send({msg: "НЕПРАВИЛЬНЫЙ ПАРОЛЬ!!!", success: false});
        }
    }
    else{
        res.send({msg: "НЕТ ТАКОГО ПОЛЬЗОВАТЕЛЯ!!!", success: false});
    }
});
app.get("/search", (req,res)=>{
    res.render("search1.hbs", {...req.session});
});
app.post("/search", async(req, res) => {
    const data = JSON.parse(req.body);
    const responce = (await FindUsers(data)).rows;
    if (responce !== undefined){
        res.send(responce);
    };
});
app.get("/myprojects", (req,res)=>{
    if (req.session.autorized){
        if (fs.existsSync(`./projects/${req.session.user.username}`)){
            const path = `./projects/${req.session.user.username}`;
            const folers = fs.readdirSync(path);
            let projects = [];
            folers.forEach(file=>{
               const innerFile = JSON.parse(fs.readFileSync(path+"/"+file+"/"+"main.json", {encoding: "utf-8"}));
               projects.push(innerFile);
            });
            res.render("myprojects.hbs", {...req.session, projects});
        }
    }
    else
        res.render("myprojects.hbs", {...req.session});
});
app.get("/logout", (req,res)=>{
    res.render("logout.hbs", {...req.session});
    req.session.autorized = false;
    req.session.user = undefined;
});
app.get("/auth/no-pass", (req,res)=>{
    if (req.session.user === undefined) res.send("Пользователь не найден. Введите имя пользователя!");
    else{
        req.session.code = genRandomString();
        sendMail({reason: "Авторизация по электронной почте", email: req.session.user.email, password: req.session.code})
        res.render("email-auth.hbs", {...req.session.user});
    }
});
app.post("/auth/no-pass", (req,res)=>{
    const valid = req.session.code;
    const {code} = JSON.parse(req.body);
    if (code === valid){
        req.session.autorized = true;
        res.send(["Вы успешно авторизовались!"]);
    }
    else{
        res.send(["Код не совпадает!"]);
    }
});
app.post("/register", async(req,res)=>{
    console.log(req.body);
    const {username, password, email} = JSON.parse(req.body);
    const salt = genRandomString();
    const encodedPassword = crypto.createHash("sha-1").update(password+salt).digest("hex");
    const responce = await RegisterUser({username, encodedPassword, salt, email});
    if (responce.rowCount > 0) {
        fs.mkdirSync(`./projects/${username}`)
    }
    res.send(responce);
});
app.post("/create-project", (req,res)=>{
    const {saveData, name, wasCreated} = JSON.parse(req.body);
    const {username} = req.session.user;
    const path = `./projects/${username}/${name}`;
    const outData = JSON.stringify({html: saveData, date: wasCreated, name: name});
    if (fs.existsSync(path) === false){
        fs.mkdirSync(path);
    };
    fs.writeFileSync(path+'/main.json', outData);
    fs.writeFileSync(path+'/comments.json', '[]');
    res.send(["Всё ок!"]);
});
app.get("/projects/:username/:project", (req,res)=>{
    const {project, username} = req.params;
    const file = JSON.parse(fs.readFileSync(`./projects/${username}/${project}/main.json`));
    const comments = JSON.parse(fs.readFileSync(`./projects/${username}/${project}/comments.json`))
    res.render("project-preview.hbs", {...req.session, ...file, comments: comments});
});
app.post("/comment", (req, res)=>{
    const {username, project, context} = JSON.parse(req.body);
    const path = `./projects/${decodeURI(username)}/${project}/comments.json`;
    const writeData = {from: req.session.user.username, context: context};
    let file = JSON.parse(fs.readFileSync(path, {encoding: "utf-8"}));
    file.push(writeData);
    fs.writeFileSync(path, JSON.stringify(file));
    res.send(["Комментарий оставлен успешно."]);
})
app.get("/register1", (req, res)=>{
    res.sendFile(__dirname+"/register1.html");
});
app.get("/profile/:user", async(req, res) => {
   const {user} =  req.params;
   const responce = (await GetUser(user)).rows[0];
   const username = responce.username;
   const projects = fs.readdirSync(`./projects/${username}`);
   res.render("user-page.hbs", {...responce, ...req.session, projects});
});
app.get("/projects/edit/:username/:project", (req, res) => {
    const {project, username} = req.params;
    const file = JSON.parse(fs.readFileSync(`./projects/${username}/${project}/main.json`));
    const comments = JSON.parse(fs.readFileSync(`./projects/${username}/${project}/comments.json`));
    res.render("project-preview.hbs", {...req.session, ...file, comments: comments, isEdit: true});
})
app.use(express.static(__dirname+"/public"));