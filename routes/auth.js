const express = require('express');
const { register, login ,get_register } = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get_register', get_register);
router.post('/register', register);
router.post('/login', login);
router.get('/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router; // Export the router