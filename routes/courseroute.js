const express = require('express');
const {get_course,course}  = require('../controller/Coursecontroller')
const {blog_post,get_blog} = require('../controller/blogcontroller')
const router = express.Router();

router.get('/get_course', get_course);

router.post('/course', course);
router.post('/blog', blog_post);
router.get('/get_blog', get_blog);

module.exports = router; // Export the router