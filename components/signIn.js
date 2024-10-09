"use strict";
const passport = require("passport");
const User = require("../models/User");
const constants = require("../config/constants");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.user.email });

    // If user is not found, return an unauthorized response
    if (!user) {
      return res
        .status(401)
        .json({ error: constants.error.auth.invalidCredentials });
    }

    // Authenticate using Passport's local strategy
    passport.authenticate("local", (error, data, info) => {
      if (error) {
        return next(error); // Pass the error to Express error handler
      }
      if (!data) {
        return res.status(401).json({ error: info.message }); // Send info.message if authentication fails
      }
      // If authentication is successful, send a success response
      res.status(200).json({ message: "Authentication successful", data });
    })(req, res, next); // Pass req, res, and next to authenticate
  } catch (error) {
    // Catch and handle any unexpected errors
    return next(error); // Pass the error to Express error handler
  }
};
