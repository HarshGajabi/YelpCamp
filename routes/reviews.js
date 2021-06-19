const express = require("express");
const route = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const { validateReviews, isLoggedIn, isReviewAuthor } = require("../middleware");

const reviewController = require("../controller/reviews");

route.post("/", isLoggedIn, validateReviews, catchAsync(reviewController.createReview));

route.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = route;