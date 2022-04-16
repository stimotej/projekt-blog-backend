const mongoose = require("mongoose");

// Admin MongoDB schema
const adminSchema = mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Editor",
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export model with created schema
module.exports = mongoose.model("Admins", adminSchema);
