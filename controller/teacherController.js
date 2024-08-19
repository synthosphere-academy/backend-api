const Teacher= require('../model/teacher');
const coursemain = require('../model/Course_main');
const Checkout = require('../model/checkout');
exports.userdetailsbyteacherid= async (req, res) => {
    const teacherId = req.params.id;
    try {
        const courses = await coursemain.find({ teacherId });
        const courseIds = courses.map(course => course._id);
    
        const purchases = await Checkout.find({ id: { $in: courseIds } }).populate('userId').populate('id');
    
        res.json(purchases);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}; 
exports.teacher_post= async (req, res) => {
    try {
        const { fullname,email,teacher_dept , password,phoneno,pancard,address} = req.body;
        const teacher_details = new Teacher({fullname,email,teacher_dept,password,phoneno,pancard,address});
        await teacher_details.save();
        res.status(201).send('Teacher is  successfully added');
    } catch (error) {
        res.status(400).send('Error teacher : ' + error.message);
    }
}; 
exports.teacher_login = async (req, res) => {
    try {
        
        const teacher_user = await Teacher.findOne({ email: req.body.username });
        if(teacher_user.password === req.body.password ){
            // const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
            
            return res.json({fullname: teacher_user.fullname, teacher_id: teacher_user._id});
            // return res.status(201).send('User login successfully');
                    
        }
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
    } catch (error) {
        res.status(400).send('Error logging in: ' + error.message);
    }
};
exports.get_teacher = async (req, res) => {
  
    try{
        
        const allteacher = await  Teacher.find({});
        res.json(allteacher);
    }catch (error){
        console.error(error);
    }
  }