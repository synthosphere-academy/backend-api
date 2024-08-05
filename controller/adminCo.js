const admin = require('../model/admin');
const {secretKey} = require('../middleware/jwtsecretkey.js');
const jwt = require('jsonwebtoken');
exports.admin_login = async (req, res) => {
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
        // // Generate the token(payload,secret_key,option)
        // const token = jwt.sign({ adminuser: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // console.log(token);
        // return res.json({ token });
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
};