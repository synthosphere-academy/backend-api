const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    course_name:{
        type: String,
        required: true
    },
    course_description:{
        type: String,
        required: true
    },
    wewilllearn:{
        type: String,
        required: true
    },
    videos:{
        type: String,
        required: true
    },
    teacher_name:{
        type: String,
        required: true
    },
    course_change:{
        type: String,
        required: true
    },
    course_price:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }

});
module.exports = mongoose.model('courses', CourseSchema);