const express = require('express');
const { register, login ,get_user,get_register,offlineregister,paymentverification,get_offline,get_payment } = require('../controller/authController');

const {admin_login} = require('../controller/adminCo');
const authMiddleware = require('../middleware/authMiddleware');
const {checkout,paymentverification_students} = require('../controller/checkoutController'); 

const router = express.Router();

router.get('/get_register', get_register);
 router.post('/offlineregister', offlineregister);
 router.post('/paymentverification', paymentverification);
 //for online student create order api(checkout)
 router.post('/checkout', checkout);
  //for online student payment verification(paymentverification_students)
 router.post('/paymentverification_students', paymentverification_students);
 router.post('/adminlogin', admin_login);
router.post('/register', register);
 router.get('/getuser', get_user);
 router.get('/getofflineuser', get_offline);
 router.get('/getpayment', get_payment);
router.post('/login',login);
// router.post('/adminlogin', admin_login);
router.post('/admin',admin_login )

router.get('/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router; // Export the router