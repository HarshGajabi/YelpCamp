const express = require("express");
const route = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampgrounds } = require("../middleware");
const campController = require("../controller/campgrounds");

route.get("/", catchAsync(campController.index));

route.get("/new", isLoggedIn, campController.renderNewForm);

route.post("/", isLoggedIn, validateCampgrounds, catchAsync(campController.createCamp));

route.get("/:id", catchAsync(campController.showCamp));

route.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campController.showEditForm));

route.put("/:id", isLoggedIn, isAuthor, validateCampgrounds, catchAsync(campController.editCamp));

route.delete("/:id", isLoggedIn, isAuthor, catchAsync(campController.deleteCamp));

module.exports = route;