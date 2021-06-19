const express = require("express");
const route = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const { validateReviews, isLoggedIn, isReviewAuthor } = require("../middleware");


route.post("/", isLoggedIn, validateReviews, catchAsync(async (req, res) => {
    const { id } = req.params;
    const currCamp = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    currCamp.reviews.push(newReview);
    await currCamp.save();
    await newReview.save();
    req.flash("success", "Successfully created the review!")
    res.redirect(`/campgrounds/${id}`);
}))

route.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = route;