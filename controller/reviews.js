const Campground = require('../models/campground');
const Review = require("../models/review");

const exp = module.exports;

exp.createReview = async (req, res) => {
    const { id } = req.params;
    const currCamp = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    currCamp.reviews.push(newReview);
    await currCamp.save();
    await newReview.save();
    req.flash("success", "Successfully created the review!")
    res.redirect(`/campgrounds/${id}`);
};

exp.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!")
    res.redirect(`/campgrounds/${id}`);
};