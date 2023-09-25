const path = require('path');
const User = require('../models/users');
const bcrypt = require('bcryptjs');


module.exports.getSignUp = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'));
}

module.exports.postSignUp = async (req,res)=>{
    const badReqest = [null,undefined,""," "];
    if(badReqest.includes(req.body.name) || badReqest.includes(req.body.email) || badReqest.includes(req.body.phone) || badReqest.includes(req.body.password)){
        res.status(401).json({message:'Bad Request'});
    }else{
        try{
            let existingUser = await User.findOne({where:{email:req.body.email}})
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