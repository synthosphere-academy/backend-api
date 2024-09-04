const coursemain = require('../model/Course_main');
const Checkout = require('../model/checkout');
const CompleteChapter = require('../model/completechapter');
exports.get_course = async (req, res) => {
    try{
        const allcourse = await  coursemain.find({});
        res.send({status:"ok" , data:allcourse })
    }catch (error){
        console.error(error);
    }
  }
  exports.getenrolledcourseby_teacherid = async (req, res) => {
    try {
      const teacherId = req.params.id;
      const courses = await coursemain.find({ teacherId });
       console.log('Courses:', courses);
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
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
        const { course_name,course_description,wewilllearn,total_video,teacherId,teacher_name,teacher_dept, course_category, course_price ,image,introduction_video,sections} = req.body;
        const course_details = new coursemain({ course_name,course_description,wewilllearn,total_video,teacherId,teacher_name,teacher_dept, course_category, course_price ,image,introduction_video,sections });
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

  exports.searchcourse = async (req, res) => {
    try {
        const query = req.query.q;
        const courses = await coursemain.find({
            course_name: { $regex: query, $options: 'i' } 
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };
  //for edit course
  exports.update_course = async (req, res) => {
    try {
      const courseId = req.params.id;
      const updateData = req.body;
      const updatedCourse = await coursemain.findByIdAndUpdate(courseId, updateData, { new: true });
      
      if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json(updatedCourse);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  //for delete course
  exports.delete_course = async (req, res) => {
    try {
      const courseId = req.params.id;
      const result = await coursemain.findByIdAndDelete(courseId);
      if (!result) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
//completed chapter of a course for a user
exports.completedchapter = async (req, res) => {
  const { userId, courseId, chapterId } = req.body;
  try {
    let completionRecord = await CompleteChapter.findOne({ userId, courseId, chapterId });
    if (completionRecord) {
      // If the record exists, update it
      completionRecord.completionStatus = true;
      completionRecord.timestamp = Date.now();
      await completionRecord.save();
    } else {
      // If it doesn't exist, create a new one
      completionRecord = new CompleteChapter({
        userId,
        courseId,
        chapterId,
        completionStatus: true,
      });
      await completionRecord.save();
    }
    res.status(200).json({ message: 'Chapter completion saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving chapter completion', error });
  }
};
//to fetch the completed chapters
exports.getCompletedChapters = async (req, res) => {
  try {
    const userId =req.params.userId;
    const courseId = req.params.id;
    const completedChapters = await CompleteChapter.find({
      userId: userId,
      courseId: courseId,
    }).select('chapterId');
    // console.log("Completed Chapters:", completedChapters);
    res.status(200).json({
      chapters: completedChapters.map((chapter) => chapter.chapterId),
    });
  } catch (error) {
    console.error('Error fetching completed chapters:', error);
    res.status(500).json({ message: 'Error fetching completed chapters', error: error.message });
  }
};