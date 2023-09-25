const path = require('path');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()


module.exports.getSignUp = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'));
}

module.exports.postSignUp = async (req,res)=>{
    const badReqest = [null,undefined,""," "];
    if(badReqest.includes(req.body.name) || badReqest.includes(req.body.email) || badReqest.includes(req.body.phone) || badReqest.includes(req.body.password)){
        res.status(401).json({message:'Bad Request'});
    }else{
        try{
            const existingUser = await User.findOne({where:{email:req.body.email}})
            if(existingUser){
                res.status(401).json({message:'User with this email already exists, login'})
            }else{
                const hashedPassword = await bcrypt.hash(req.body.password,10);
                await User.create({name:req.body.name,email:req.body.email,phone:req.body.phone,password:hashedPassword});
                res.status(201).json({message:'SignUp Successful'});
            }
        }catch(err){
            console.log(err);
            res.status(500).json({message:'Some error occured'});
        }
    }
}

module.exports.getLogin = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'));
}

module.exports.postLogin = async (req,res)=>{
    const badReqest = [null,undefined,""," "];
    if(badReqest.includes(req.body.email) || badReqest.includes(req.body.password)){
        res.status(401).json({message:'Bad Request'});
    }else{
        try{
            const user = await User.findOne({where:{email:req.body.email}});
            if(user){
                bcrypt.compare(req.body.password,user.password,(err,success)=>{
                    if(success){
                        res.status(201).json({message:'Login Successful',token:jwtCrypt(user.id,user.name,user.email,user.phone)})
                    }else{
                        res.status(401).json({message:'Wrong Password'});
                    }
                })
            }else{
                res.status(404).json({message:'User with this email dont exist, SignUp'});
            }
        }catch(err){

        }
    }
}

function jwtCrypt(id,name,email,phone){
    return jwt.sign({id,name,email,phone},process.env.JWTSECRET)
}