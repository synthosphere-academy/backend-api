const mongoose = require('mongoose');
const CheckoutSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    phoneno:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    id:{
        type: String,
        required: true
    },
    courses:{
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
module.exports = mongoose.model('Checkout', CheckoutSchema);