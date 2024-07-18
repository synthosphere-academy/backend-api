const coursemain = require('../model/Course_main');
const Checkout = require('../model/checkout');

exports.get_course = async (req, res) => {
    // res.status(200).json({ message: "This api working fine courses" });
    try{
        // res.status(200).json({ message: "This api working fine" });
        const allcourse = await  coursemain.find({});
        res.send({status:"ok" , data:allcourse })
    }catch (error){
        console.error(error);
    }
  }
  exports.getenrolledcourseby_userid = async (req, res) => {
    try {
      const userId = req.params.id;
      const orders = await Checkout.find({ userId });
      const courseIds = orders.map(order => order.id);
      // console.log('Course IDs:', courseIds);
  
      // Fetch course details manually
      const courses = await coursemain.find({ _id: { $in: courseIds } });
      // console.log('Courses:', courses);
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  exports.course = async (req, res) => {
    try {
        const { course_name,course_description,wewilllearn,total_video,teacher_name, course_category, course_price ,image,sections} = req.body;
        const course_details = new coursemain({ course_name,course_description,wewilllearn,total_video,teacher_name, course_category, course_price ,image,sections });
        await course_details.save();
        res.status(201).send('Course is  successfully added');
    } catch (error) {
        res.status(400).send('Error course : ' + error.message);
    }
};

// Get a single course by ID
exports.getcourse_by_id = async (req, res) => {
    try {
     
      const course = await coursemain.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(course);
      // res.send({ status:"ok", data:course })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };