var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Take token from request header
  const token = req.header("auth-token");

  // If there is no token return 401
  if (!token) return res.status(401).send("Access Denied");

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    // If token is not valid send 400
    res.status(400).send("Invalid token");
  }
};
