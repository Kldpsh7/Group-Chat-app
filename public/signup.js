async function signup(e){
    e.preventDefault();
    const obj = {
        name:e.target.name.value,
        email:e.target.email.value,
        phone:e.target.phone.value,
        password:e.target.password.value
    }
    try{
        const res = await axios.post('/user/signup',obj);
        document.body.innerHTML+=`<p style="font-family:courier; color:green">${res.data.message}</p>`;
        setTimeout(() => {
            document.location.href='/user/login';
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