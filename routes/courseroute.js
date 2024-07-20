const express = require('express');
const {getenrolledcourseby_userid,get_course,course,getcourse_by_id,searchcourse }  = require('../controller/Coursecontroller')
const {blog_post,get_blog,getblogby_id} = require('../controller/blogcontroller')
const verifyToken = require('../middleware/authMiddleware.js');
const router = express.Router();

router.get('/get_course', get_course);
router.post('/course', course);
router.post('/blog', blog_post);
router.get('/get_blog', get_blog);
router.get('/get_blog/:id', getblogby_id);
router.get('/getcoursebyid/:id',getcourse_by_id);
router.get('/getenrolledcourse/:id', verifyToken, getenrolledcourseby_userid);
router.get('/searchcourse',searchcourse);

module.exports = router; // Export the router