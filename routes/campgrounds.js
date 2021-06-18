const express = require("express");
const route = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");


const validateCampgrounds = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

route.get("/", catchAsync(async (req, res) => {
    const allCamps = await Campground.find({});
    res.render("campgrounds/index.ejs", { allCamps });
}));

route.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

route.post("/", isLoggedIn, validateCampgrounds, catchAsync(async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "Successfully created a new campground!")
    res.redirect(`/campgrounds/${newCamp._id}`);
})
);

route.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const currCamp = await Campground.findById(id).populate("reviews").populate("author");
    if (!currCamp) {
        req.flash("error", "Cannot find the requested Campground!")
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/show.ejs", { camp: currCamp });
}));

route.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const currCamp = await Campground.findById(id);
    if (!currCamp) {
        req.flash("error", "Cannot find the requested Campground!");
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit.ejs", { camp: currCamp });
}));

route.put("/:id", isLoggedIn, validateCampgrounds, catchAsync(async (req, res) => {
    const { id } = req.params;
    const oldCamp = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash("success", "Successfully edited the campground!")
    res.redirect(`/campgrounds/${oldCamp._id}`);
}));

route.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const oldCamp = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!")
    res.redirect(`/campgrounds`);
    })
);



module.exports = route;