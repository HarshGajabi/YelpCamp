const express = require("express");
const route = express.Router();
const User = require('../models/user');
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
// const { campgroundSchema } = require("../schemas.js");

route.get("/register", (req, res) => {
    res.render("users/register.ejs")
})

route.post("/register", catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to YelpCamp!");
            res.redirect("/campgrounds");
        })   
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}))

route.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

route.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
        req.flash("success", "Welcome back to YelpCamp!");
        const redirectUrl = req.session.returnToUrl || "/campgrounds";
        delete req.session.returnToUrl;
        res.redirect(redirectUrl);
    }
)

route.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out")
    res.redirect("/campgrounds");
})

module.exports = route;