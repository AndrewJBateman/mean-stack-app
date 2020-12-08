const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //  get the token after "Bearer "
    const decodedToken = jwt.verify(
      token,
      "secret_in_prod_this_is_longer_and_random"
    );
    // append new object userData to request; this will be passed on through the middleware chain
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
    };
    next(); // required to continue down the middleware chain
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};
