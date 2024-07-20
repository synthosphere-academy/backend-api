const blog = require('../model/blog');
exports.blog_post= async (req, res) => {
    try {
        const { blogtitle,blogdescription,shortdescription,image} = req.body;
        const blog_details = new blog({blogtitle,blogdescription,shortdescription,image });
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
  exports.getblogby_id = async (req, res) => {
    try {
     
      const blogdetails = await blog.findById(req.params.id);
      if (!blogdetails) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(blogdetails);
      // res.send({ status:"ok", data:course })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };