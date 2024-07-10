const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
        
    },
    phoneno:{
        type: String,
        required: true,
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
        
    },
    course:{
        type: String,
        required: true
        
    },
    amount: {
        type: String,
        required: true
    },
    
    createdAt: {
         type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('offlineusers', userSchema);
