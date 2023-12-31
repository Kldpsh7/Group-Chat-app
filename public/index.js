document.addEventListener('DOMContentLoaded',()=>{
    checkLogin()
    localStorage.removeItem('chat')
})

axios.defaults.headers.common['auth'] = localStorage.getItem('token');

function checkLogin(){
    const token = localStorage.getItem('token');
    if(!token){
        document.location.href='/user/login';
    }
    else{
        const parsedToekn = parseJwt(token);
        document.getElementById('page-heading-div').innerHTML += `<p style="font-family:courier">Welcome ${parsedToekn.name}</p><button id='logout-btn' onclick='logout()'>Logout</button>`
        getGroups();
    }
}

async function getGroups(){
    const res = await axios.get('/chat/group');
    console.log(res.data)
    showGroupsOnScreen(res.data);
}

function showGroupsOnScreen(data){
    const groupList = document.getElementById('groups-ul');
    groupList.innerHTML='';
    groupList.innerHTML+='<h3 class="your-groups">Your Groups</h3>';
    for(let item of data){
        let li = document.createElement('li');
        li.id=item.id;
        li.className='group-list-item';
        li.innerHTML=item.name;
        groupList.appendChild(li)
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

let createGrpDiv = document.getElementById('new-group-div');
let divContent = createGrpDiv.firstElementChild;

function newGroup(){
    createGrpDiv.innerHTML='<form onsubmit="createGroup(event)" id="new-group-form"><label class="label" for="group-name">New Group Name</label><input type="text" id="group-name" name="name" required><button type="submit" id="create-group-btn">Create</button></form>'
}

function logout(){
    localStorage.removeItem('token');
    document.location.href='/user/login';
}

async function createGroup(e){
    e.preventDefault();
    try{
        const res = await axios.post('/chat/creategroup',{name:e.target.name.value});
        createGrpDiv.innerHTML='';
        createGrpDiv.appendChild(divContent);
        getGroups()
    }catch(err){console.log(err)}
}

document.getElementById('groups-ul').addEventListener('click',(e)=>{
    if(e.target.className=='group-list-item'){
        localStorage.setItem('grpid',e.target.id);
        document.location.href='/chat/chat'
    }
})