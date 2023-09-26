document.addEventListener('DOMContentLoaded',()=>{
    checkLogin();
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
        loadChat();
    }
}

async function loadChat(){
    try{
        const res = await axios.get('/chat/loadChat');
        const chatList = document.getElementById('message-ul');
        chatList.innerHTML='';
        for(let item of res.data){
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
    }catch(err){
        console.log(err);
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