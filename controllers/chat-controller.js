const path = require('path');
const User = require('../models/users');
const Chat = require('../models/chats');
const Member = require('../models/member');
const Group = require('../models/group');
const Sequelize = require('sequelize');
const { error } = require('console');
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
        const groups = await req.user.getGroups();
        res.status(200).json(groups);
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Some Error Occured'})
    }
}

module.exports.postCreateGroup = async (req,res)=>{
    try{
        await req.user.createGroup({name:req.body.name,createdBy:req.user.id});
        res.status(201).json({message:'Group Created Successfully'})
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Some Error Occured'});
    }
}

module.exports.getGroupDetails = async (req,res)=>{
    try{
        const groups = await req.user.getGroups({where:{id:req.headers.grpid}})
        res.status(200).json(groups[0])
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Some Error Occured'});
    }
}

module.exports.getGroupMembers = async (req,res)=>{
    try{
        const group = await Group.findByPk(req.headers.grpid)
        const members = await group.getUsers();
        res.status(200).json(members);
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Some Error Occured'});
    }
}

module.exports.postChangeGroupName = async (req,res)=>{
    try{
        const group = await Group.findByPk(req.headers.grpid)
        group.name=req.body.name;
        await group.save();
        res.status(201).json({newname:req.body.name});
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Some Error Occured'});
    }
}

module.exports.postAddNewMember = async (req,res)=>{
    try{
        const group = await Group.findByPk(req.headers.grpid);
        const user = await User.findOne({where:{email:req.body.email}});
        if(user){
            await group.addUser(user);
            res.status(201).json({message:'User added successfully'});
        }else{
            throw new error({message:'User Dont Exist'});
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Some Error Occured'});
    }
}

module.exports.postRemoveMember = async (req,res)=>{
    try{
        const group = await Group.findByPk(req.headers.grpid);
        const user = await User.findOne({where:{id:req.body.id}});
        if(user){
            await group.removeUser(user);
            res.status(201).json({message:'User removed successfully'});
        }else{
            throw new error({message:'User Dont Exist'});
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Some Error Occured'});
    }
}