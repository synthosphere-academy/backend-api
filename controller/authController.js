const User = require('../model/student');
 const offlineUsers = require('../model/offlineregester');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




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
        const allofflineuser = await  offlineUsers.find({});
        res.send({status:"ok" , data:allofflineuser })
    }catch (error){
        console.error(error);
    }
  
}
exports.offlineregister = async (req, res) => {
    try {
        const { fullname,phoneno,date,States,cities, email,course, image } = req.body;
        const offlineuser = new offlineUsers({ fullname, phoneno,date,States ,cities,email, course,image });
        await offlineuser.save();
        res.status(201).send('User registered successfully');
       
    } catch (error) {
        res.status(400).send('Error registering user: ' + error.message);
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


