const contactus = require('../model/contactus');
exports.contact= async (req, res) => {
    try {
        const { name,email,message} = req.body;
        const contactus_details = new contactus({name,email,message });
        await contactus_details.save();
        res.status(201).send('form is  successfully submitted');
    } catch (error) {
        res.status(400).send('Error formsubmit : ' + error.message);
    }
}; 
exports.get_contact = async (req, res) => {
    try {
      const allcontact = await contactus.find({});
      res.send({ status: "ok", data: allcontact })
    } catch (error) {
      console.error(error);
      res.status(400).send('Error : ' + error.message);
    }
  }