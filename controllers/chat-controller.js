const path = require('path');
const User = require('../models/users');
const Chat = require('../models/chats');
const Member = require('../models/member');
const Group = require('../models/group');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports.getChatPage = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','chat.html'));
}

module.exports.getChatHomePage = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','index.html'));
}

module.exports.getLoadChats = async(req,res)=>{
    try{
        const groups = await req.user.getGroups({where:{id:req.headers.grpid}})
        const chats = await groups[0].getChats({where:{id:{[Op.gt]:req.query.lastMsgId}}});
        res.status(200).json(chats);
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Server Error'});
    }
}

module.exports.postNewMessage = async (req,res)=>{
    const groups = await req.user.getGroups({where:{id:req.headers.grpid}})
    await groups[0].createChat({message:req.body.message,sendername:req.user.name});
    res.status(200).json({message:'sent'})
}

module.exports.getGroups = async (req,res)=>{
    try{
        const createdGroups = await req.user.getGroups();
        const joinedGroupsIDs = await Member.findAll({where:{useremail:req.user.email}});
        const joinedGroups = await Group.findAll({where:{id:{[Op.or]:[joinedGroupsIDs]}}});
        res.status(200).json({createdGroups:createdGroups,joinedGroups:joinedGroups});
        console.log(joinedGroupsIDs,joinedGroups)
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Some Error Occured'})
    }
}

module.exports.postCreateGroup = async (req,res)=>{
    try{
        await req.user.createGroup({name:req.body.name});
        res.status(201).json({message:'Group Created Successfully'})
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Some Error Occured'});
    }
}