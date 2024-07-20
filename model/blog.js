const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
    blogtitle:{
        type: String,
        required: true
    },
    blogdescription:{
        type: String,
        required: true
    },
    shortdescription:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }

});
module.exports = mongoose.model('blog', BlogSchema);