const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.user.id);
    if (!req.user) {
      return res.status(401).json({ msg: "User does not exist" });
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
