const admin = require('../model/admin');
const secretKey = process.env.JWT_SECRET_KEY;
const jwt = require('jsonwebtoken');


// Admin login
const admin_login = async (req, res) => {
    try {
       
        const admin_user = await admin.findOne({ username: req.body.username });
       
            // res.status(201).send('admin login successfully');
        if (admin_user.password !== req.body.password) {
            return res.status(400).send('Invalid username or password');
        } 
        if (!admin_user) {
            return res.status(400).send('Invalid email or password');
        }
        if(admin_user){
            const token = jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: '5h' });
            return res.json({ admin_token: token ,admin_id: admin.id});
        }
       
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
};


module.exports = {
    admin_login
}