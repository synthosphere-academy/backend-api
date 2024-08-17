const jwt = require('jsonwebtoken');
const {secretKey} = require('../middleware/jwtsecretkey.js');
// console.log(secretKey);

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        // console.log('Authorization header is missing');
        return res.status(401).json({ error: 'Unauthorized authheader' });
      }
      const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Token is missing');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // console.log('Token:', token); 
    // const token = req.headers['authorization'];
    // console.log(token)
    // if (!token) {

    //   return res.status(403).json({ error: 'No token provided' });
    // }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.userId = decoded;
      next();
    });
  };
  
  module.exports = verifyToken;
