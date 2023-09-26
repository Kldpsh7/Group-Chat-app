const path = require('path');

module.exports.getChat = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','chat.html'));
}