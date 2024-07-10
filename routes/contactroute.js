const express = require('express');
const {contact} = require('../controller/contactusController')
const router = express.Router();
router.post('/contactus', contact);
module.exports = router; // Export the router