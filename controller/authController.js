const User = require('../model/student');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// exports.get_register = (req, res) => {
//     res.status(200).json({ message: "This api working fine" });
  
//   }
exports.get_user= async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const alluser = await  User.find({});
        res.send({status:"ok" , data:alluser })
    }catch (error){
        console.error(error);
    }
   
  
}
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
            res.status(201).send('User login successfully');
        }
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
};

