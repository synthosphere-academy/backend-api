const User = require('../model/student');
 const offlineusers = require('../model/offlineregester');
 const Payment = require('../model/payment.js');
 const onlinepayment = require('../model/checkout.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const  instance = require('../server.js');
const crypto = require('crypto');
const secretKey = process.env.JWT_SECRET_KEY;
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const sendMail = require('../utils/nodemailer.js');





//get register testing purpose
exports.get_register = (req, res) => {
    res.status(200).json({ message: "This api working fine" });
  
  }
// get all student details from User schema
exports.get_user= async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const alluser = await  User.find({});
        res.send({status:"ok" , data:alluser })
    }catch (error){
        console.error(error);
    }
   
  
}
//get all offline student details from offlineusers schema
exports.get_offline= async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const allofflineuser = await  offlineusers.find({});
        res.send({status:"ok" , data:allofflineuser })
    }catch (error){
        console.error(error);
    }
  
}

//get all  offline student payment details from payment schema
exports.get_payment= async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const allpaymentdetails = await  Payment.find({});
        res.send({status:"ok" , data:allpaymentdetails })
    }catch (error){
        console.error(error);
    }
 
}

//for  online student payment details from checkout schema
exports.get_onlinepayment= async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const allpaymentdetails = await  onlinepayment.find({});
        res.send({status:"ok" , data:allpaymentdetails })
    }catch (error){
        console.error(error);
    }
}
//for  offline student form registration 
exports.offlineregister= async(req,res) => {
try{
     const { fullname,phoneno,date,States,cities, email,course ,amount} = req.body;
     const offlineuser_details = new offlineusers({ fullname, phoneno,date,States ,cities,email, course,amount });
        
 const  options = {
         amount: Number(req.body.amount * 100),
         //amount: 5000,
        currency: "INR"
       
      };
      const order = await instance.orders.create(options)
       console.log(order);
     await offlineuser_details.save();
        res.status(200).json({success:true, order});
}catch(error) {
    console.error('Error creating Razorpay order:', error);
    res.status(400).send('Internal Server Error');
}

};

// for offline student payment verification
exports.paymentverification= async(req,res) => {
    
    // console.log(razorpay_order_id);
    // console.log(razorpay_payment_id);
    // console.log(razorpay_signature);
    try{
        const { fullname,phoneno,course,amount,razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        const hmac = crypto.createHmac('sha256',  process.env.RAZORPAY_API_SECRET);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');
        console.log(fullname);
        console.log(razorpay_signature);
        
        if (generated_signature === razorpay_signature) {
            //database
            // console.log('Inside block');
            const paymentdetails = new Payment({ fullname,phoneno,course,amount,razorpay_order_id, razorpay_payment_id,razorpay_signature });
            // console.log('Saving user data:', paymentdetails);
            // console.log('1st attempt');
            await paymentdetails.save();
            // console.log('1. payment details saved successfully');
            // console.log('User data saved successfully');
            //  return res.redirect('http://localhost:5173/PaymentSucess');
            res.status(200).send({ status: 'success' });
        } 
    }catch(error) {
        console.log(error.message);
        console.error('Error creating Razorpay:', error);
        res.status(400).send({ status: 'failure' });     
    }
    };

//registration api for student
exports.register = async (req, res) => {
    try {
        const { fullname,phoneno,date,States,cities, email, password } = req.body;
        const user = new User({ fullname, phoneno,date,States ,cities,email, password });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send('Error registering user: ' + error.message);
    }
};

// login api for student
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });
        return res.json({ token, fullname: user.fullname, user_id: user.id});
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
};
//get user details by its id
exports.getuser_by_id = async (req, res) => {
    try {
        const userId = req.params.id;
         console.log(userId);
      const userdetails = await User.findById((userId));
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      if (!userdetails) {
        return res.status(404).json({ error: 'user not found' });
      }
      res.status(200).json(userdetails);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };



// handle forgot password
exports.handleforgotpassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      };

      // generate JWT token
      const payload = {email: user.email}
      const token = jwt.sign(payload, secretKey, { expiresIn: 600 });

      // send verification email
      console.log('1. Sending email');
      
      let response = await sendMail('forgotPassword', user, token);
      if(response == 'sent')   return res.status(200).json({success: 'Email sent successfully! Please check your email to forgot your password.'});
      else if(response == 'error') return res.status(500).send({error: 'Error in sending verification email.'});
      else return res.status(500).json({error: 'Internal Server Error'});
    }catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.handleVerifyLinkSentOnEmail =  async (req, res) => {
    try{
        const token = req.query.token;
        if(!token) return res.status(401).json({error: 'Link Expired!'});

        const payload = jwt.verify(token, secret);
        if(!payload) return res.status(401).send('Link Expired!');

        const user = await User.findOne({email: payload.email});
        if(!user) return res.status(401).json({message: 'Account not found!'});

        res.status(200).json({message: 'Email verification successful', user: user});
    }catch(err){
        res.status(401).json({ error: 'Session Expired. Please Login again.' });
    }
};


exports.handleUpdatePassword =  async (req, res) => {
    try{
    const {email, password, confirm_password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(401).json({message: 'Account not found!'});

    if(!email || !password || !confirm_password) return res.status(401).json({message: 'All fields must be filled.'});
    if(password !== confirm_password) return res.status(401).json({message: "Passwords & confirm password didn't match."});

    
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
        
    res.status(200).json({message: 'Password updated successfully. Now you can login.', user: user});
    }catch(err){
        res.status(401).json({ error: 'Session Expired. Please Login again.' });
    }
};