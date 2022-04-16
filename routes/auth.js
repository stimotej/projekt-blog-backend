const router = require("express").Router();
const Admin = require("../models/Admin");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
  updateAdminValidation,
} = require("../validation");
const verifyToken = require("./verifyToken");

// Get list of admins - if logged in
router.get("/", verifyToken, async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get single admin by id - if logged in
router.get("/:adminId", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    res.json(admin);
  } catch (err) {
    res.json({ message: err });
  }
});

// REGISTER NEW ADMIN USER - if logged in
router.post("/register", verifyToken, async (req, res) => {
  // Validate register data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email is already in database
  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // Check if username is already in database
  const usernameExist = await Admin.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send("Username already exists");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create admin
  const admin = new Admin({
    username: req.body.username,
    password: hashedPassword,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  });

  // Save admin to MongoDB
  try {
    const savedAdmin = await admin.save();
    res.json(savedAdmin);
  } catch (err) {
    res.json({ message: err });
  }
});

// LOGIN ADMIN USER
router.post("/login", async (req, res) => {
  // Validate login data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find user by username
  const user = await Admin.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Username or password is wrong");

  // Check password on that user
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Username or password is wrong");

  // Create and send token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send({
    token: token,
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  });
});

// UPDATE ADMIN - if logged in
router.patch("/:adminId", verifyToken, async (req, res) => {
  // Validate register data
  const { error } = updateAdminValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email is already in database
  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist && emailExist._id != req.params.adminId)
    return res.status(400).send("Email already exists");

  // // Hash password
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const updatedAdmin = await Admin.updateOne(
      { _id: req.params.adminId },
      {
        $set: {
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
        },
      }
    );
    res.json(updatedAdmin);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete admin - if logged in
router.delete("/:adminId", verifyToken, async (req, res) => {
  try {
    const removedAdmin = await Admin.remove({ _id: req.params.adminId });
    res.json(removedAdmin);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
