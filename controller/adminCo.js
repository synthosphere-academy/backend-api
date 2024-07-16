const admin = require('../model/admin');
const jwt = require('jsonwebtoken');
exports.admin_login = async (req, res) => {
    try {
        // const { username, password } = req.body;
        const admin_user = await admin.findOne({ username: req.body.username });
        if(admin_user){
            res.status(201).send('admin login successfully');
            return;
        }  
        if (!admin_user) {
            return res.status(400).send('Invalid email or password');
        }
        // // Generate the token(payload,secret_key,option)
        // const token = jwt.sign({ adminuser: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // console.log(token);
        // return res.json({ token });
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
};