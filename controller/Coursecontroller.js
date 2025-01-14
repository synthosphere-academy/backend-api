const coursemain = require('../model/Course_main');
const Checkout = require('../model/checkout');
const CompleteChapter = require('../model/completechapter');
const User = require('../model/student');
exports.get_course = async (req, res) => {
    try{
        const allcourse = await  coursemain.find({});
        const coursesWithRatings = allcourse.map(course => {
          let totalRatings = course.reviews.length; // Total number of reviews
          let sumRatings = course.reviews.reduce((sum, review) => sum + review.rating, 0); // Sum of all review ratings
          let averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(2) : 0; // Calculate average rating
          if (averageRating % 1 > 0.5) {
            // If decimal part > 0.5, round up
            averageRating = Math.ceil(averageRating);
          } else {
            // If decimal part <= 0.5, round down
            averageRating = Math.floor(averageRating);
          }
      
          // Attach the averageRating to each course object
          return {
              ...course._doc, // Spread the course document (Mongoose-specific)
              averageRating: averageRating // Attach the average rating
          };
      });
        
        res.send({status:"ok" , data:coursesWithRatings })
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


// handle submit review
exports.handlesubmitreview = async (req, res) => {
  try {
    const { user_id, rating, comment} = req.body;
    const courseId = req.params.id;

    // Find user
    const user = await User.findOne({ _id: user_id});
    if(!user) {return res.status(400).json({ message: 'User not found' });}

    // Find course
    const course = await coursemain.findOne({_id: courseId});
    if(!course) {return res.status(400).json({ message: 'Course not found' });}


    // Check if user has already submitted a review for this course
    const reviewExists = course.reviews.some(review => review.user_id.toString() === user_id);
    if (reviewExists) {
      return res.status(400).json({ message: 'Review already submitted.' });
    }
    
    // Add the review to the course's reviews array
    course.reviews.push({
      user_id: user_id, 
      username: user.fullname,
      rating: rating, 
      comment: comment, 
    });
    await course.save();

    return res.status(200).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error });
  }
};


// Handle delete review by admin
exports.handledeletereview = async (req, res) => {
  try {
    const courseId = req.params.id; // Course ID from request params
    const review_owner_id = req.params.reviewownerid; // Review_owner ID from request params
    console.log(courseId);
    console.log(review_owner_id);
    // Find course by ID
    const course = await coursemain.findOne({courseId});
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the review index by review_owner_id
    const reviewIndex = course.reviews.findIndex(review => review.user_id.toString() === review_owner_id);
    // Remove the review from the reviews array
    course.reviews.splice(reviewIndex, 1);
    await course.save();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
};


// Handle show all reviews
exports.handleshowreviews = async (req, res) => {
  try {
    const courseId = req.params.id; 
    // Find course by ID
    const course = await coursemain.findById({_id: courseId});
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({reviews: course.reviews});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
}



// Find average rating
// Import necessary modules
 // Adjust path based on your project structure

// Function to calculate the average rating

