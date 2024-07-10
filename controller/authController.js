const User = require('../model/student');
 const offlineusers = require('../model/offlineregester');
 const Payment = require('../model/payment.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const  instance = require('../server.js');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');
require('dotenv').config();




exports.get_register = (req, res) => {
    res.status(200).json({ message: "This api working fine" });
  
  }
exports.get_user= async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const alluser = await  User.find({});
        res.send({status:"ok" , data:alluser })
    }catch (error){
        console.error(error);
    }
   
  
}

exports.get_offline= async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const allofflineuser = await  offlineusers.find({});
        res.send({status:"ok" , data:allofflineuser })
    }catch (error){
        console.error(error);
    }
  
}
exports.get_payment= async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const allpaymentdetails = await  Payment.find({});
        res.send({status:"ok" , data:allpaymentdetails })
    }catch (error){
        console.error(error);
    }

   
    
  
}





// exports.offlineregister = async (req, res) => {
    
//     try {
//         const { fullname,phoneno,date,States,cities, email,course, image } = req.body;
//         const userExists = offlineUsers.find(offlineUsers.email === email);
//         // if (userExists) {
//         //     return res.status(400).json({error:'User already exists'});
//         // }
//         const offlineuser = new offlineUsers({ fullname, phoneno,date,States ,cities,email, course });
//         await offlineuser.save();
//         res.status(201).send('User registered successfully');
       
//     } catch (error) {
//         res.status(400).send('Error registering user: ' + error.message);
//     }
// };
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
       const save_offilineuser = await offlineuser_details.save();
       
    // Get the ObjectId of the saved user
    const userId = save_offilineuser._id;

        res.status(200).json({success:true, order});
}catch(error) {
    console.error('Error creating Razorpay order:', error);
    res.status(400).send('Internal Server Error');
}

};

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
            // await payment.create({
            //     razorpay_order_id, razorpay_payment_id, razorpay_signature
            // });
             //const offlineuser = new offlineUsers({ fullname, phoneno,date,States ,cities,email, course ,amount,razorpay_payment_id,razorpay_order_id});
            //        await offlineuser.save();
            // return res.redirect('http://localhost:5173/PaymentSucess')
            // res.status(200).send({ status: 'success' });
        } 
    
    }catch(error) {
        console.error('Error creating Razorpay:', error);
        res.status(400).send({ status: 'failure' });
       
    }
    
    };


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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(user){
            // const token  = jwt.sign({email: user.email},process.env.JWT_SECRET,{expiresIn: '1h'},(err,res)=>{
            //     if(res){
            //         res.json({ token })
            return res.json({ email: user.fullname });
            return res.status(201).send('User login successfully');
                  
                //  }else{
                //     return res.send({result:"something went"})
                //  }

            // }) 
           
                    // return res.send(user,{auth:token});
                  
            
             
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


