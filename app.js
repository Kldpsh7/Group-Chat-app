const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors');

const userRoutes = require('./routes/user-routes');
const chatRoutes = require('./routes/chat-routes');

const sequelize = require('./database/db');
const User = require('./models/users');
const Chat = require('./models/chats');
const exp = require('constants');

const app = express()

app.use(bodyParser.json());
app.use(cors({origin:"*",methods:['GET','POST','DELETE','PUT']}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/chat',chatRoutes);
app.use('/user',userRoutes);

Chat.belongsTo(User);
User.hasMany(Chat);

sequelize.sync().then(()=>{
    const server = app.listen(3000)
    console.log('Listening on port = ',server.address().port)
})