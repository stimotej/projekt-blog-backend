const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  // Get user id from request
  const userId = req.user._id;

  // Get user by id
  const user = await Admin.findById(userId);

  // If user is not admin return 403
  if (user.role !== "Admin") return res.status(403).send("Access Denied");

  next();
};
