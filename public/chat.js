document.addEventListener('DOMContentLoaded',()=>{
    localStorage.removeItem('chat')
    checkLogin();
})

axios.defaults.headers.common['auth'] = localStorage.getItem('token');
axios.defaults.headers.common['grpid'] = localStorage.getItem('grpid');
let groupAdmin;

function checkLogin(){
    const token = localStorage.getItem('token');
    if(!token){
        document.location.href='/user/login';
    }
    else{
        const parsedToekn = parseJwt(token);
        //document.getElementById('page-heading-div').innerHTML += `<p style="font-family:courier">Welcome ${parsedToekn.name}</p><button id='logout-btn' onclick='logout()'>Logout</button>`
        getGroup();
        loadChat();
    }
}

async function loadChat(){
    try{
        let localChat = JSON.parse(localStorage.getItem('chat'));
        let lastMsgId;
        if(localChat && localChat.length>0){
            lastMsgId = localChat[localChat.length-1].id;
        }else{
            localChat=[];
            lastMsgId = 0;
        }
        const res = await axios.get(`/chat/loadChat?lastMsgId=${lastMsgId}`);
        showOnScreen(res.data);
        localChat = localChat.concat(res.data);
        localStorage.setItem('chat',JSON.stringify(localChat));
    }catch(err){
        console.log(err);
    }
}

function showOnScreen(data){
    const chatList = document.getElementById('message-ul');
    for(let item of data){
        let chat = document.createElement('li');
        chat.className='chat';
        let sender = document.createElement('span');
        sender.className='sender';
        sender.innerHTML=item.sendername+'  >>  ';
        chat.appendChild(sender);
        let messagBody = document.createElement('span');
        messagBody.className='message-body';
        messagBody.innerHTML=item.message;
        chat.appendChild(messagBody)
        chatList.appendChild(chat);
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

function logout(){
    localStorage.removeItem('token');
    document.location.href='/user/login';
}

async function sendMessage(e){
    e.preventDefault();
    try{
        const obj = {message: e.target.message.value};
        const res = await axios.post('/chat/send',obj);
        e.target.message.value='';
        loadChat();
    }catch(err){
        console.log(err)
    }
}

async function getGroup(){
    try{
        const res = await axios.get('/chat/groupdeatils');
        groupAdmin = res.data.createdBy;
        const pageHeading = document.getElementById('page-heading');
        pageHeading.innerHTML=res.data.name;
        pageHeading.innerHTML += '<button id="group-edit-button" onclick="editGroup()">&#128396</button>';
    }catch(err){
        console.log(err);
    }
}

async function editGroup(){
    const pageHeading = document.getElementById('page-heading');
    pageHeading.lastElementChild.remove();
    const pageHeadingDiv = document.getElementById('page-heading-div');
    const pageEditDiv = document.createElement('div');
    pageEditDiv.innerHTML=`<form id="group-name-edit-form" onsubmit="changeGroupName(event)"> <label class="label" for="new-name">Change Group Name</label><input type="text" id="new-name" name="name" value="${pageHeading.innerHTML}"><button type="submit" id="edit-btn">Save</button </form>`;
    pageEditDiv.innerHTML+='<h4 id="member-list-heading">Group Members</h4>';
    const memberList = document.createElement('ul');
    memberList.id='member-list';
    const res = await axios.get('/chat/groupmembers');
    console.log(res.data);
    for(let member of res.data){
        let li=document.createElement('li');
        li.id=member.id;
        li.innerHTML=member.name;
        let removeBtn = document.createElement('button');
        removeBtn.className='remove-btn';
        removeBtn.innerHTML='Remove';
        removeBtn.setAttribute('onclick','removeMember(event)');
        if(member.id!=groupAdmin){
            li.appendChild(removeBtn);
        }
        memberList.appendChild(li);
    }
    pageEditDiv.appendChild(memberList);
    pageEditDiv.innerHTML += `<form id="new-member-form" onsubmit="addMember(event)"><label class="label" for="name">Add New Member</label><input type="email" id="add-new-member-email-input" name="email" class="new-mamber-input" placeholder="(Registered Email-Id of User)" required><button class="new-member-btn" type="submit">ADD</button></form>`
    pageEditDiv.innerHTML+='<button onclick="doneEditing()" id="close-editing-btn">DONE</button>'
    pageHeadingDiv.appendChild(pageEditDiv);
}

async function changeGroupName(e){
    e.preventDefault();
    const user = parseJwt(localStorage.getItem('token'));
    if(user.id!==groupAdmin){
        alert('Only Admin Can Do That');
    }else{
        try{
            const res = await axios.post('/chat/changegroupname',{name:e.target.name.value});
            console.log('name chnged')
            document.getElementById('page-heading').innerHTML=res.data.newname;
            doneEditing();
        }catch(err){
            console.log(err);
        }
    }
}

async function removeMember(e){
    const user = parseJwt(localStorage.getItem('token'));
    if(user.id!==groupAdmin){
        alert('Only Admin Can Do That');
    }else{
        try{
            await axios.post('/chat/removemember',{id:e.target.parentElement.id});
            alert('Member Removed');
            doneEditing();
        }catch(err){
            console.log(err);
            alert('Something Wrong');
        }
    }
}

async function addMember(e){
    e.preventDefault();
    const user = parseJwt(localStorage.getItem('token'));
    if(user.id!==groupAdmin){
        alert('Only Admin Can Do That');
    }else{
        try{
            await axios.post('/chat/addnewmember',{email:e.target.email.value});
            alert('Member Added');
            doneEditing();
        }catch(err){
            console.log(err);
            alert('user dont exist or already in group')
        }
    }
}

function doneEditing(){
    document.getElementById('page-heading').innerHTML+='<button id="group-edit-button" onclick="editGroup()">&#128396</button>';
    document.getElementById('page-heading-div').lastElementChild.remove();
}

// setInterval(()=>{
//     loadChat()
// },1000)