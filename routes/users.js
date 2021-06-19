const express = require("express");
const route = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const userController = require("../controller/users");

route.route("/register")
    .get(userController.renderRegisterForm)
    .post(catchAsync(userController.registerUser));

route.route("/login")
    .get(userController.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        userController.loginUser);

route.get("/logout", userController.logoutUser);

module.exports = route;