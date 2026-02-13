const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const optionalAuth = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select(
        "-password -updatedAt -__v"
      );
      if (user) {
        req.user = user;
      }
    }
  } catch (e) {
    // Ignore invalid/expired tokens here to preserve anonymous read-only access.
  }

  next();
};

module.exports = optionalAuth;
