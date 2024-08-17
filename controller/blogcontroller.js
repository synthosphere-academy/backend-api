const blog = require('../model/blog');
exports.blog_post= async (req, res) => {
    try {
        const { blogtitle,blogdescription,shortdescription,slug,image} = req.body;
        const blog_details = new blog({blogtitle,blogdescription,shortdescription,slug,image });
        await blog_details.save();
        res.status(201).send('Blog is  successfully added');
    } catch (error) {
        res.status(400).send('Error blog : ' + error.message);
    }
}; 
exports.get_blog = async (req, res) => {
    try{
        // res.status(200).json({ message: "This api working fine" });
        const allblog = await  blog.find({});
        res.send({status:"ok" , data:allblog })
    }catch (error){
        console.error(error);
    }
  }
  // exports.getblogby_id = async (req, res) => {
  //   try {
     
  //     const blogdetails = await blog.findById(req.params.id);
  //     if (!blogdetails) {
  //       return res.status(404).json({ error: 'blog not found' });
  //     }
  //     res.json(blogdetails);
  //     // res.send({ status:"ok", data:course })
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // };
  exports.getblogby_slag = async (req, res) => {
    try {
     
      const blogdetails = await blog.findOne({slug: req.params.slug });
      if (!blogdetails) {
        return res.status(404).json({ error: 'blog not found' });
      }
      res.json(blogdetails);
      // res.send({ status:"ok", data:course })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  //edit blog
  exports.update_blog = async (req, res) => {
    try {
      const blogId = req.params.id;
      const updateData = req.body;
      const updatedblog = await blog.findByIdAndUpdate(blogId, updateData, { new: true });
      
      if (!updatedblog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      res.status(200).json(updatedblog);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  //delete blog
  exports.delete_blog = async (req, res) => {
    
  
    try {
      const blogId = req.params.id;
      console.log(blogId);
      const result = await blog.findByIdAndDelete(blogId);
  
      if (!result) {
        return res.status(404).json({ message: 'blog not found' });
      }
      res.status(200).json({ message: 'blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };