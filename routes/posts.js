const express = require("express");
const Post = require("../models/Post");
const Admin = require("../models/Admin");
const verifyToken = require("./verifyToken");
var jwt = require("jsonwebtoken");
const verifyAdmin = require("./verifyAdmin");

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get users posts
router.get("/my", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const { _id: userId } = jwt.decode(token);

  try {
    const posts = await Post.find({
      "author.id": userId,
    });
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get single post by id
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (err) {
    res.json({ message: err });
  }
});

// Create post - if logged in
router.post("/", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const { _id: userId } = jwt.decode(token);

  const user = await Admin.findById(userId);

  const post = new Post({
    image: req.body.image,
    title: req.body.title,
    body: req.body.body,
    category: req.body.category,
    description: req.body.description,
    author: { id: user.id, name: user.name },
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete post - if logged in
router.delete("/:postId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.json(removedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// Update post - if logged in
router.patch("/:postId", verifyToken, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      { _id: req.params.postId },
      {
        $set: {
          image: req.body.image,
          title: req.body.title,
          body: req.body.body,
          category: req.body.category,
          description: req.body.description,
        },
      }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// COMMENTS

// Get all comments on post
router.get("/:postId/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comments = post.comments;
    res.json(comments);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get specific comment on post
router.get("/:postId/comments/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.id(req.params.commentId);
    res.json(comment);
  } catch (err) {
    res.json({ message: err });
  }
});

// Post comment on post
router.post("/:postId/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    post.comments.push({
      body: req.body.body,
      name: req.body.name,
    });

    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

// Delete comment on post - if logged in
router.delete(
  "/:postId/comments/:commentId",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      post.comments.id(req.params.commentId).remove();

      const savedPost = await post.save();
      res.json(savedPost);
    } catch (err) {
      res.json({ message: err });
    }
  }
);

// Update comment post - if logged in
router.patch("/:postId/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.id(req.params.commentId);
    comment.set({
      body: req.body.body,
      author: req.body.author,
    });

    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
