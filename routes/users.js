const express = require("express");
const route = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const userController = require("../controller/users");

route.get("/register", userController.renderRegisterForm);

route.post("/register", catchAsync(userController.registerUser));

route.get("/login", userController.renderLoginForm);

route.post("/login",
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    userController.loginUser
);

route.get("/logout", userController.logoutUser);

module.exports = route;