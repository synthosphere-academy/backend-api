const mongoose = require('mongoose');

    // Chapter Schema
const ChapterSchema = new mongoose.Schema({
    chapter_id: { 
        type: mongoose.Schema.Types.ObjectId,
        auto: true },
    chapter_name: {
         type: String, 
         required: true 
        },
    Video_link: { 
        type: String,
        required: true
     }
  });

// Section Schema
const SectionSchema = new mongoose.Schema({
    section_id:
     { 
        type: mongoose.Schema.Types.ObjectId,
        auto: true
     },
    section_name: { 
        type: String, 
        required: true 
    },
    chapters: [ChapterSchema]
  });
  //course 
  const Course_Schema = new mongoose.Schema({
    course_name:
     { 
        type: String,
        required: true
     },
    course_description: 
    { type: String ,
      required: true
    },
    wewilllearn:{
        type: String,
        required: true
    },
    total_video:{
        type:String,
        required: true
    },
    teacher_name:{
        type: String,
        required: true
    },
    course_category:{
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
    },
    introduction_video:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
       default: Date.now 
   },
    sections: [SectionSchema],  
  },
    
);
module.exports = mongoose.model('coursemain', Course_Schema);