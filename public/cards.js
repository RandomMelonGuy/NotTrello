const getLastID = () => {
    let id = 0;
    a = document.getElementById(id);
    while (a !== null){
        id+=1;
        a = document.getElementById(id);
    }
    return id;
}
let id = getLastID();
try{
    window.onload = document.getElementById("name").showModal();
}
catch(err){
    
}
/*const arrow = arrowCreate({
    from: document.getElementById('from'),
    to: document.getElementById('to'),
});*/
//document.body.appendChild(arrow.node);
//const bottomBorder = document.getElementsByClassName("listPages")[0].getBoundingClientRect().bottom;
function onMouseDrag(event, element) {
            let leftValue = parseInt(window.getComputedStyle(element).left);
            let topValue = parseInt(window.getComputedStyle(element).top);
            element.style.left = `${leftValue + event.movementX}px`;
            element.style.top = `${topValue + event.movementY}px`;
        }
const createCardPrefab = (id, data=null) => {
    if (data !== null){
        const cardPrefab = `
        <p>Введите заголовок</p>
        <input type="text" maxlength="100" class="card-field" id="header${id}" value="${data.header}">
        <p>Введите краткое содержание</p>
        <input type="text" maxlength="1000" class="card-field" id="desc${id}" value="${data.desc}">
        <p>Введите полное содержание</p>
        <textarea class="card-text" id="fullDesc${id}" value="${data.fullyDesc}"></textarea>
        <input type="file" class="card-field" id="file${id}">
        <button class="compileBtn" onclick="compileCard(${id})">Создать</button>`
        return cardPrefab;
    }
    const cardPrefab = `
        <p>Введите заголовок</p>
        <input type="text" maxlength="100" class="card-field" id="header${id}">
        <p>Введите краткое содержание</p>
        <input type="text" maxlength="1000" class="card-field" id="desc${id}">
        <p>Введите полное содержание</p>
        <textarea class="card-text" id="fullDesc${id}"></textarea>
        <input type="file" class="card-field" id="file${id}">`;
        return cardPrefab;
}
const btns = [document.getElementById("idea"),document.getElementById("work"),document.getElementById("realization"),document.getElementById("done")];
const workSpaces = [document.getElementById("ideaWorkSpace"),document.getElementById("workWorkSpace"),document.getElementById("realizationWorkSpace"),document.getElementById("doneWorkSpace")];
let activeWorkSpace = document.getElementById("ideaWorkSpace");
const openWorkspace = (obj) => {
    btns.forEach(el=>{
        if (el.id != obj.id){
            el.classList.remove("current");
        }
        else{
            el.classList.add("current");
        }
    })
    const id = obj.id+"WorkSpace";
    workSpaces.forEach(el=>{
        if (el.id != id){
            el.classList.add("inactive");
        }
        else{
            el.classList.remove("inactive");
            activeWorkSpace = el;
        }
    })
}
const createCard = () => {
    const card = document.createElement("div");
    console.log(card.getBoundingClientRect().top);
    card.addEventListener("mousedown", e=>{
        const onMove = (event) => onMouseDrag(event, card); 
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", onMove);
            }, { once: true });
    });
    card.id = id;
    card.classList.add(`card`);
    card.innerHTML = createCardPrefab(id);
    card.innerHTML += `<button class="compileBtn" onclick="compileCard(${id})">Создать</button>`
    activeWorkSpace.appendChild(card);
    id+=1;
}
const compileCard = (id) => {
    const card = document.getElementById(id);
    const header = document.getElementById("header"+id).value;
    const desc = document.getElementById("desc"+id).value;
    const fullDesc = document.getElementById("fullDesc"+id).value;
    const file = document.getElementById("file"+id).value;
    //const showData = fullDesc.length > 100 ? fullDesc.slice(0,40)+"..." : fullDesc;
    console.log(file);
    if (header != "" & desc!="" & fullDesc!=""){
        card.innerHTML = `<p class="card-p">Заголовок:</p><p id="header${id}">${header}</p><p class="card-p">Краткое содержание:</p><p id="desc${id}">${desc}</p><p class="card-p">Полное содержание</p><p id="fullyDesc${id}">${fullDesc}</p><p class="card-p">Приложение</p><div></div><hr class="card-hr">`; // <button onclick="deleteCard(${id})">Удалить</button><button onclick="editCard('${id}')">Редактировать</button>
    }
    else{
        alert("Не введены значения!");
    }
}
const saveData = (prevName="") => {
    const saveData = document.getElementById("saveInfo").innerHTML;
    /*const idWork = document.getElementById("ideaWorkSpace").innerHTML;
    const workWork = document.getElementById("workWorkSpace").innerHTML;
    const reaWork = document.getElementById("realizationWorkSpace").innerHTML;
    const doneWork = document.getElementById("doneWorkSpace").innerHTML; */
    if (prevName !== ""){
        const name = prevName;
        const wasCreated = new Date().toString();
        fetch("/create-project", {method: "POST", body: JSON.stringify({saveData, name, wasCreated})}).then(res=>res.json()).then(data=>alert(data));
    }
    else{
        const name = document.getElementById("projectName").value;
        const wasCreated = new Date().toString();
        fetch("/create-project", {method: "POST", body: JSON.stringify({saveData, name, wasCreated})}).then(res=>res.json()).then(data=>alert(data));
    }
}

const comment = (project, isEdit) => {
    const context = document.getElementById("comment").value;
    if (isEdit){
        const username = window.location.href.split("/")[5];
        fetch("/comment", {method: "POST", body: JSON.stringify({username, project, context})}).then(data=>data.json()).then(data=>{alert(data.json());window.location.reload();});
    }
    else{
        const username = window.location.href.split("/")[4];
        fetch("/comment", {method: "POST", body: JSON.stringify({username, project, context})}).then(data=>{window.location.reload();});
    }
}
const deleteCard = (id) => {
    const card = document.getElementById(id);
    card.remove();
}
const editCard = (id) => {
    const card = document.getElementById(id);
    const header = document.getElementById("header"+id).innerText;
    const desc = document.getElementById("desc"+id).innerText;
    const fullyDesc = document.getElementById("fullyDesc"+id);
    console.log(createCardPrefab(id, {header, desc, fullyDesc}));
    card.innerHTML = createCardPrefab(id, {header, desc, fullyDesc});
}
const initEdit = () => {
    const card = document.getElementsByClassName("card");
    for (el of card){
        el.addEventListener("mousedown", e=>{
            const onMove = (event) => onMouseDrag(event, el); 
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", () => {
                    document.removeEventListener("mousemove", onMove);
                }, { once: true });
        });
    }
};