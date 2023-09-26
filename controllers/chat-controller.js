const path = require('path');
const User = require('../models/users');
const Chat = require('../models/chats');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports.getChatPage = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','chat.html'));
}

module.exports.getLoadChats = async(req,res)=>{
    try{
        const chats = await Chat.findAll({where:{id:{[Op.gt]:req.query.lastMsgId}}});
        res.status(200).json(chats);
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Server Error'});
    }
}

module.exports.postNewMessage = async (req,res)=>{
    await req.user.createChat({message:req.body.message,sendername:req.user.name});
    res.status(200).json({message:'sent'})
}