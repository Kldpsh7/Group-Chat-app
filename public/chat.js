document.addEventListener('DOMContentLoaded',()=>{
    localStorage.removeItem('chat')
    checkLogin();
})

axios.defaults.headers.common['auth'] = localStorage.getItem('token');
axios.defaults.headers.common['grpid'] = localStorage.getItem('grpid');

function checkLogin(){
    const token = localStorage.getItem('token');
    if(!token){
        document.location.href='/user/login';
    }
    else{
        const parsedToekn = parseJwt(token);
        document.getElementById('page-heading-div').innerHTML += `<p style="font-family:courier">Welcome ${parsedToekn.name}</p><button id='logout-btn' onclick='logout()'>Logout</button>`
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
        console.log(res.data)
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

setInterval(()=>{
    loadChat()
},1000)