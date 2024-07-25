const User = require('../model/student');
 const offlineusers = require('../model/offlineregester');
 const Payment = require('../model/payment.js');
 const onlinepayment = require('../model/checkout.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const  instance = require('../server.js');
const crypto = require('crypto');
const {secretKey} = require('../middleware/jwtsecretkey.js');
const { default: mongoose } = require('mongoose');
require('dotenv').config();


console.log(secretKey)


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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(razorpay_order_id);
    console.log(razorpay_payment_id);
    console.log(razorpay_signature);

    try{
        const { fullname,phoneno,course,amount,razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
    
        const hmac = crypto.createHmac('sha256',  process.env.RAZORPAY_API_SECRET);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');
        console.log(generated_signature);
        console.log(fullname);
        
        console.log(razorpay_signature);
        if (generated_signature === razorpay_signature) {
            //database
            const paymentdetails = new Payment({ fullname,phoneno,course,amount,razorpay_order_id, razorpay_payment_id,razorpay_signature });
            console.log('Saving user data:', paymentdetails);
            try {
                await paymentdetails.save();
                console.log('User data saved successfully');
            } catch (error) {
                console.error('Error saving user data:', error.message);
            }
            return res.redirect('http://localhost:5173/PaymentSucess');
            // res.status(200).send({ status: 'success' });
        } 
    
    }catch(error) {
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
        if(user){
            const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
            
            return res.json({ token, fullname: user.fullname, user_id: user.id});
            // return res.status(201).send('User login successfully');
                    
        }
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,{expiresIn: '1h' });
        // res.json({ token });
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
      // res.send({ status:"ok", data:course })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


