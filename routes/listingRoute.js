const express = require("express");
const router = express.Router();

 const Listingmodel = require("../models/listing.js");

const wrapAsync = require("../Errorhandle/wrapAsync.js");

const {isLoggedIn, isOwnerListing, validateListing} = require("../middleware.js");  // authentication middleware for login

const listingController = require("../controllers/listingsController.js") // middleware for routes of listing

const multer  = require('multer'); // multer helps to upload any image or file in the clouds.

const {storage} = require("../cloudConfig.js"); // we always require our cloudinary storage above upload.

 const upload = multer({ storage }); // here multer will upload our image into a folder named "storage" inside cloudinary, which we have required above upload as  " const {storage} = require("../cloudConfig.js") "  .
 



 


//combining routes with common path together
router
    .route("/")
    .get( wrapAsync(listingController.indexRouteListing))  // index route

    .post(isLoggedIn, upload.single("listingKey[image]"), wrapAsync(listingController.createNewListing)); // "upload.single" is a middleware which will take single image from "listingKey[image]" field and then will upload it in cloudinary. 






// New route(it will fetch a form to create new listing),  we must write "new route" before "/:id" path because of "id" or else we will get error. we have written this path "/listingmodel/new" which will fetch the "new form" inside "navbar". "/listingmodel" is the common path which we have defined in app.js

router.get("/new",isLoggedIn, listingController.renderNewForm);// "isLoggedIn" is a middleware we have created in "middleware.js" which checks weather user is authenticated or not while we try to log in, that is weather the user is already exist in the database or not.







// search route,we must place "search route" above 'show route' , otherwise code will take '/search' as an id and we will get error    
router.get("/search", wrapAsync(listingController.searchFunction));




// View cart route
router.get("/cart", wrapAsync(listingController.ViewCaertPage));


router
    .route("/:id")
    .get( wrapAsync(listingController.showRouteListing))     // show route
    .put( isLoggedIn, isOwnerListing,upload.single("listingKeyUpdate[image]"), wrapAsync(listingController.updateListing))    // update route
    .delete( isLoggedIn,isOwnerListing, wrapAsync(listingController.deleteListing));  // delete listing route





 
// show route and edit route are same, in both the case we fetched the detailes of single listing from "Listing" collection through "Listingmodel schema" and then render those detailes in show.ejs page and edit.ejs form respectively
 router.get("/:id/edit",isLoggedIn,isOwnerListing, wrapAsync(listingController.renderEditForm))
 



 // Filter by Category Route
router.get("/category/:category", wrapAsync(listingController.categoryListing));



// Add to cart route
router.post("/cart/:id",  wrapAsync(listingController.AddCartRoute) );




// delete cart listing route
router.delete("/cart/:id",  wrapAsync(listingController.deleteCartListing) );




module.exports = router;



















