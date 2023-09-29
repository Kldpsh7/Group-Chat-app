const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const cron = require('node-cron');

const userRoutes = require('./routes/user-routes');
const chatRoutes = require('./routes/chat-routes');

const sequelize = require('./database/db');
const User = require('./models/users');
const Chat = require('./models/chats');
const Group = require('./models/group');
const Membership = require('./models/member');
const Archive = require('./models/archive');

const app = express()

app.use(bodyParser.json());
app.use(cors({origin:"*",methods:['GET','POST','DELETE','PUT']}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/chat',chatRoutes);
app.use('/user',userRoutes);
app.use('/',(req,res)=>{res.redirect('/chat/home')});

Chat.belongsTo(Group);
Group.hasMany(Chat);

Group.belongsToMany(User,{through:Membership});
User.belongsToMany(Group,{through:Membership});


sequelize.sync().then(()=>{
    app.listen(3000,()=>{
        console.log('Listening on port 3000');
        cron.schedule('0 3 * * *',backup)
    })
})


async function backup() {
    console.log('backup called')
    let backupDate = new Date()
    backupDate.setDate(backupDate.getDate() - 1);
    try{   
        let chats = await Chat.findAll({where:{createdAt:{[Op.lt]:backupDate}}})
        for(let record of chats){
            await Archive.create({message:record.message,sendername:record.sendername,UserId:record.userId});
            record.destroy();
        }
    }catch(err){
        console.log(err)
    }
}
backup()