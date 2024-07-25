const express = require('express');
const {getenrolledcourseby_userid,get_course,course,getcourse_by_id,searchcourse,update_course,delete_course }  = require('../controller/Coursecontroller')
const {blog_post,get_blog,getblogby_id,update_blog} = require('../controller/blogcontroller')
const verifyToken = require('../middleware/authMiddleware.js');
const router = express.Router();

router.get('/get_course', get_course);
router.put('/editcourses/:id',update_course);
router.post('/course', course);
router.post('/blog', blog_post);
router.get('/get_blog', get_blog);
router.get('/get_blog/:id', getblogby_id);

router.put('/editblog/:id', update_blog);
router.get('/getcoursebyid/:id',getcourse_by_id);
router.get('/getenrolledcourse/:id', verifyToken, getenrolledcourseby_userid);
router.get('/searchcourse',searchcourse);
router.delete('/deletecourse/:id',delete_course);

module.exports = router; // Export the router