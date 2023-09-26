async function login(e){
    e.preventDefault();
    const obj = {
        email:e.target.email.value,
        password:e.target.password.value
    }
    try{
        const res = await axios.post('/user/login',obj);
        document.body.innerHTML+=`<p style="font-family:courier; color:green">${res.data.message}</p>`;
        localStorage.setItem('token',res.data.token);
        setTimeout(() => {
            document.location.href='/chat/chat';
            document.body.lastElementChild.remove();
        }, 1000);
    }catch(err){
        console.log(err);
        document.body.innerHTML+=`<p style="font-family:courier; color:red">${err.response.data.message}</p>`;
        setTimeout(() => {
            document.body.lastElementChild.remove();
        }, 2000);
    }
}