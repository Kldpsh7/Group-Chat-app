const Sequelize = require("sequelize");
const sequelize = require('../database/db');

const Chat = sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    sendername:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Chat;