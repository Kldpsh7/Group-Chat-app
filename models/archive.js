const Sequelize = require("sequelize");
const sequelize = require('../database/db');

const Archive = sequelize.define('archive',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    message:{
        type:Sequelize.STRING,
    },
    sendername:{
        type:Sequelize.STRING,
    },
    groupId:Sequelize.INTEGER
})

module.exports = Archive;