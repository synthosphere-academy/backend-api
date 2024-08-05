const mongoose = require('mongoose');
const TeacherSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phoneno:{
        type: String,
        required: true
    },
    pancard:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model('teacher', TeacherSchema);