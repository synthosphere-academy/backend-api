const express = require('express');
const { register, login ,get_user,get_register,offlineregister,get_offline } = require('../controller/authController');

const {admin_login} = require('../controller/adminCo');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get_register', get_register);
 router.post('/offlineregister', offlineregister);
router.post('/register', register);
 router.get('/getuser', get_user);
 router.get('/getofflineuser', get_offline);
router.post('/login',login);
// router.post('/adminlogin', admin_login);
router.post('/admin',authMiddleware,admin_login )

router.get('/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router; // Export the router