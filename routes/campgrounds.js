const express = require("express");
const route = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampgrounds } = require("../middleware");
const campController = require("../controller/campgrounds");

route.route("/")
    .get(catchAsync(campController.index))
    .post(isLoggedIn, validateCampgrounds, catchAsync(campController.createCamp));

route.get("/new", isLoggedIn, campController.renderNewForm);

route.route("/:id")
    .get(catchAsync(campController.showCamp))
    .put(isLoggedIn, isAuthor, validateCampgrounds, catchAsync(campController.editCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campController.deleteCamp));

route.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campController.showEditForm));

module.exports = route;