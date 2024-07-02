const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
        
    },
    phoneno:{
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required:true
    },
    States:{
        type: String,
        required: true 
    },
    cities: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    course:{
        type: String,
        required: true
        
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
         type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('offlineUsers', userSchema);
