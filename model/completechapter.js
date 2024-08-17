const mongoose = require('mongoose');
const CompletecourseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId,  ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId,   ref: 'coursemain' ,required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'coursemain', required: true },
    completionStatus: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
})
module.exports = mongoose.model('CompleteChapter', CompletecourseSchema);