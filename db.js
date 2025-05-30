const {Pool} = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "MelonTheDeveloper",
    port: "5432",
    database:"taskmaster"
})
async function RegisterUser(val){
    return await pool.query(`INSERT INTO users(username, password, salt, email) VALUES('${val.username}', '${val.encodedPassword}', '${val.salt}', '${val.email}');`).catch(err=>{return err.code});
}
async function AuthUser(data) {
    return await pool.query(`SELECT * FROM users WHERE username='${data}'`);
}
async function FindUsers(data) {
    return await pool.query(`SELECT * FROM users WHERE username LIKE '%${data.nameVal}%';`);
}
async function GetUser(username) {
    return await pool.query(`SELECT * FROM users WHERE username='${username}';`);
}
module.exports= {RegisterUser, AuthUser, FindUsers, GetUser};