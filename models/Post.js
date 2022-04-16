const mongoose = require("mongoose");

// Post MongoDB schema
const postSchema = mongoose.Schema({
  image: String,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    id: String,
    name: String,
  },
  category: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Draft",
  },
  comments: [
    {
      body: String,
      name: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

// Export model with created schema
module.exports = mongoose.model("Posts", postSchema);
