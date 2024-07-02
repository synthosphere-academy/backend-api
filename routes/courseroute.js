const express = require('express');
const {get_course,course}  = require('../controller/Coursecontroller')
const router = express.Router();

router.get('/get_course', get_course);

router.post('/course', course);

module.exports = router; // Export the router