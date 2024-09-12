const blog = require('../model/blog');


// Create new blog
const blog_post = async (req, res) => {
  try {
    const { blogtitle, slug, blogdescription, shortdescription, image } = req.body;
    const blog_details = new blog({ blogtitle, slug, blogdescription, shortdescription, image });
    await blog_details.save();
    res.status(201).send('Blog is  successfully added');
  } catch (error) {
    res.status(400).send('Error blog : ' + error.message);
  }
};


// Get all blogs
const get_blog = async (req, res) => {
  try {
    const allblog = await blog.find({});
    res.send({ status: "ok", data: allblog })
  } catch (error) {
    console.error(error);
  }
}

// Get blog by ID
const getblogby_id = async (req, res) => {
  try {

    const blogdetails = await blog.findById(req.params.id);
    if (!blogdetails) {
      return res.status(404).json({ error: 'blog not found' });
    }
    res.json(blogdetails);
    // res.send({ status:"ok", data:course })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get blog by slug
const getblogby_slag = async (req, res) => {
  try {

    const blogdetails = await blog.findOne({ slug: req.params.slug });
    if (!blogdetails) {
      return res.status(404).json({ error: 'blog not found' });
    }
    res.json(blogdetails);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update blog
const update_blog = async (req, res) => {
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


// Delete a blog
const delete_blog = async (req, res) => {


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





module.exports = {
  blog_post,
  get_blog,
  getblogby_id,
  getblogby_slag,
  update_blog,
  delete_blog
}