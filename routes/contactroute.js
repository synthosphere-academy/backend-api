const express = require('express');
const {contact,get_contact} = require('../controller/contactusController')
const router = express.Router();
router.post('/contactus', contact);
router.get('/getallcontact', get_contact);
module.exports = router; // Export the router