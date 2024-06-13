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
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(400).send('Invalid email or password');
        // }
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
};