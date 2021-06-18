const express = require("express");
const route = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require("../schemas.js");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require('../utils/catchAsync');


const validateReviews = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

route.post("/", validateReviews, catchAsync(async (req, res) => {
    const { id } = req.params;
    const currCamp = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    currCamp.reviews.push(newReview);
    await currCamp.save();
    await newReview.save();
    req.flash("success", "Successfully created the review!")
    res.redirect(`/campgrounds/${id}`);
}))

route.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = route;