const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const app = express();

// Connect to DB
const CONNECTION_URL =
  "";
const CONNECT_OPTIONS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(CONNECTION_URL, CONNECT_OPTIONS)
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/images", express.static(path.join("backend/images")));

// set Headers and allow CORS; this is redundant since app use cors();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow any domain origins
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // allow these extra Headers in addition to the default ones
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS" // OPTIONS is sent by default prior to POST requests to check if valid
  );
  next();
});

// using the routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
