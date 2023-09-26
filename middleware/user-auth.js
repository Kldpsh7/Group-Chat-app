require('dotenv').config();
const User = require('../models/users');
const jwt = require('jsonwebtoken');

module.exports.authenticate = async(req,res,next)=>{
    try{
        const token = req.headers.auth;
        const decodedToken = jwt.decode(token,process.env.JWTSECRET);
        const user = await User.findByPk(decodedToken.id);
        if(user){
            console.log(user);
            req.user=user;
            next();
        }else{
            res.redirect('/user/login')
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Something Wrong'})
    }
}