const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");

/* Signup Controller */
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created successfully",
          result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error: unable to save user to database.",
          error: err,
        });
      });
  });
});

/*Login Controller */
router.post("/login", (req, res, next) => {
  let fetchedUser; // scoped var
  User.findOne({ email: req.body.email })
    .then((user) => {
      // find user
      if (!user) {
        return res.status(401).json({
          message: "Auth failed. User not found!",
        });
      }

      fetchedUser = user; // assign to scope variable in order to access it for jwt.sign() below
      return bcrypt.compare(req.body.password, user.password); // compare passwords with bcrypt
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed at bcrypt compare passwords.",
        });
      }
      // create json webtoken and send to frontend
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "A_long_string_as_a_secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token,
        message: "Token created successfully",
        expiresIn: 3600, // this will set off timer in auth.service
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth failed at jwt token creation.",
      });
    });
});

module.exports = router;
