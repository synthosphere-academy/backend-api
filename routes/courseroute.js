const express = require('express');
const {getenrolledcourseby_userid,getenrolledcourseby_teacherid,get_course,course,getcourse_by_id,searchcourse,update_course,delete_course,completedchapter,getCompletedChapters,handlesubmitreview,handledeletereview }  = require('../controller/Coursecontroller')
const {blog_post,get_blog,getblogby_id,getblogby_slag,update_blog,delete_blog} = require('../controller/blogcontroller')
const verifyToken = require('../middleware/authMiddleware.js');
const router = express.Router();

router.get('/get_course', get_course);
router.put('/editcourses/:id',update_course);
router.post('/course', course);
router.post('/blog', blog_post);
router.get('/get_blog', get_blog);
 router.get('/get_blog/:id', getblogby_id);

router.get('/getblog/:slug', getblogby_slag);

router.delete('/deleteblog/:id',delete_blog);
router.put('/editblog/:id', update_blog);
router.get('/getcoursebyid/:id',getcourse_by_id);
router.get('/getenrolledcourse/:id', verifyToken, getenrolledcourseby_userid);
router.get('/getcoursebyteacher/:id', getenrolledcourseby_teacherid);
router.get('/searchcourse',searchcourse);
router.delete('/deletecourse/:id',delete_course);
router.post('/completedchapter', completedchapter);
router.get('/getcompletedchapter/:userId/:id', getCompletedChapters);

// New Routes added by Ankit
router.post('/submitreview/:id', handlesubmitreview);
router.post('/deletereview/:courseId/:review_owner_id', handledeletereview);

module.exports = router;