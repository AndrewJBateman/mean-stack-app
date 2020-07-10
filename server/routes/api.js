require("dotenv").config();

const express = require("express");
const router = express.Router();
//const MongoClient = require('mongodb').MongoClient; 
const mongoose = require("mongoose");
//const ObjectID = require('mongodb').ObjectID;

mongoose.set("useFindAndModify", false);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB, { useNewUrlParser: true }, (err, db) => {
  if (err) {
    console.log("Database connection error: " + err);
  } else {
    console.log("Successful database connection on port: " + process.env.PORT);
  }
});

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == "object" ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null,
};

// Get all users
router.get("/users", (req, res) => {
  connection((db) => {
    db.collection("users")
      .find()
      .toArray()
      .then((users) => {
        response.data = users;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

module.exports = router;
