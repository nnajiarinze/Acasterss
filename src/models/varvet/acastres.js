const mongoose = require('mongoose');

const AcastresSchema = new mongoose.Schema({
    title: {
        type: String
    },
    checksum: {
        type: String
    },
    url:{
        type:String
    }
});



 
const Acast = mongoose.model('Acast',AcastresSchema);




module.exports = Acast;