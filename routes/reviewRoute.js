const express = require("express");
const router = express.Router({mergeParams:true});  // here in router of reviewRout we are using "mergeParams:true" to access ":id" from "app.js" of "app.use("/listingmodel/:id/reviews/" , because ":id" which is the "id of listings"  from "app.use("/listingmodel/:id/reviews/", reviewRoute)"  is not reaching here in reviewRoute.js. so inorder to access this ":id" from "app.js" we will use "mergeParams:true" in router of reviewRoutes. since to post or submit reviews for a listing , first we need to find that particular listing and then only we can post reviews for that listing. ( but in case of "listingRoute" we are adding our listings directly, therefore we dont need to write "mergeParams:true" in case of "listingRoute" ).

const Listingmodel = require("../models/listing.js");
const Reviewmodel = require("../models/review.js");

const wrapAsync = require("../Errorhandle/wrapAsync.js");
const {validateReview, isLoggedIn, isOwnerReview} = require("../middleware.js")

const reviewController = require("../controllers/reviewController.js") // middleware for routes of reviews




//Post Review Route
router.post("/",isLoggedIn, wrapAsync(reviewController.postReview))



// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isOwnerReview, wrapAsync(reviewController.deleteReview));

module.exports = router;