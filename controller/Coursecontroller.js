const courses = require('../model/course');

exports.get_course = async (req, res) => {
    // res.status(200).json({ message: "This api working fine courses" });
    try{
        // res.status(200).json({ message: "This api working fine" });
        const alluser = await  courses.find({});
        res.send({status:"ok" , data:alluser })
    }catch (error){
        console.error(error);
    }
  }
  exports.course = async (req, res) => {
    try {
        const { course_name,course_description,wewilllearn,videos,teacher_name, course_change, course_price ,image} = req.body;
        const course_details = new courses({ course_name,course_description,wewilllearn,videos,teacher_name, course_change, course_price ,image });
        await course_details.save();
        res.status(201).send('Course is  successfully added');
    } catch (error) {
        res.status(400).send('Error course : ' + error.message);
    }
};  