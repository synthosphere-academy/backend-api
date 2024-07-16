const Checkout = require('../model/checkout');
const  instance = require('../server.js');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');
require('dotenv').config();


exports.checkout= async(req,res) => {
    try{
        //  const { fullname,phoneno,date,States,cities, email,course ,amount} = req.body;
        //  const offlineuser_details = new offlineusers({ fullname, phoneno,date,States ,cities,email, course,amount });
            
     const  options = {
             amount: Number(req.body.amount * 100),
             //amount: 5000,
            currency: "INR"
           
          };
          const order = await instance.orders.create(options)
           console.log(order);
         //await offlineuser_details.save();
            res.status(200).json({success:true, order});
    }catch(error) {
        console.error('Error creating Razorpay order:', error);
        res.status(400).send('Internal Server Error');
    }
    
    };

    exports.paymentverification_students= async(req,res) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log(razorpay_order_id);
        console.log(razorpay_payment_id);
        console.log(razorpay_signature);
    
        try{
            const{ fullname,phoneno,state,city,email,courses,amount,razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        
            const hmac = crypto.createHmac('sha256',  process.env.RAZORPAY_API_SECRET);
            hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
            const generated_signature = hmac.digest('hex');
            console.log(generated_signature);
            console.log(fullname);
            
            console.log(razorpay_signature);
            if (generated_signature === razorpay_signature) {
                
                //database
                const paymentdetails_student = new Checkout({ fullname,phoneno,state,city,email,courses,amount,razorpay_order_id, razorpay_payment_id,razorpay_signature });
                console.log('Saving user data:', paymentdetails_student);
                try {
                    await paymentdetails_student.save();
                    console.log('student paymentdata saved successfully');
                    // res.status(200).send({ status: 'success' });
                } catch (error) {
                    console.error('Error saving user data:', error.message);
                }
                return res.redirect('http://localhost:5173/PaymentSucess');
                 
            } 
        
        }catch(error) {
            console.error('Error creating Razorpay:', error);
            res.status(400).send({ status: 'failure' });
           
        }
        
        };
    
    