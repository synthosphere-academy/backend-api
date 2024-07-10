const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    phoneno:{
        type: String,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    amount:{
        type: String,
        required: true
    },
    razorpay_order_id:{
        type: String,
        required: true
    },
    razorpay_payment_id:{
        type: String,
        required: true
    },
    razorpay_signature:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
       default: Date.now 
   }

});
module.exports = mongoose.model('Payment', PaymentSchema);