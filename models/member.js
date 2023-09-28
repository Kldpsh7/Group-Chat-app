const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const Member = sequelize.define('member',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    }
})

module.exports = Member;