const jwt = require('jsonwebtoken');
const userModel = require('../models/user'); // Adjust the path as necessary

const authenticate = async (req, res, next) => {
  const token = req.cookies.token; // Retrieve the token from the cookie

  if (!token) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, 'shhhh'); // Replace 'shhhh' with your secret key
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    req.userId = user._id; // Attach the userId to the request object
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    res.status(400).send("Invalid token.");
  }
};

module.exports = authenticate;
