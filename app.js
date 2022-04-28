const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
var cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Gzip compression
app.use(compression());

// CORS
app.use(cors());

// Parse body to JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Routes
const postsRoute = require("./routes/posts");
const authRoute = require("./routes/auth");

// Middleware functions for routes
app.use("/api/posts", postsRoute);
app.use("/api/admin", authRoute);

// Connect to MongoDB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// Listen server on port
app.listen(port, () => {
  console.log(`App running.`);
});
