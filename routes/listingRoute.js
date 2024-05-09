const express = require("express");
const router = express.Router();

const wrapAsync = require("../Errorhandle/wrapAsync.js");

const {isLoggedIn, isOwnerListing, validateListing} = require("../middleware.js");  // authentication middleware for login

const listingController = require("../controllers/listingsController.js") // middleware for routes of listing

const multer  = require('multer'); // multer helps to upload any image or file in the clouds.

const {storage} = require("../cloudConfig.js"); // we always require our cloudinary storage above upload.

 const upload = multer({ storage }); // here multer will upload our image into a folder named "storage" inside cloudinary, which we have required above upload as  " const {storage} = require("../cloudConfig.js") "  .
 



//combining routes with common path together
router
    .route("/")
    .get( wrapAsync(listingController.indexRouteListing))  

    .post(isLoggedIn, upload.single("listingKey[image]"), wrapAsync(listingController.createNewListing)); // "upload.single" is a middleware which will take single image from "listingKey[image]" field and then will upload it in cloudinary. 




// New route(it will fetch a form to create new listing),  we must write "new route" before "/:id" path because of "id" or else we will get error. we have written this path "/listingmodel/new" which will fetch the "new form" inside "navbar". "/listingmodel" is the common path which we have defined in app.js

router.get("/new",isLoggedIn, listingController.renderNewForm);




router
    .route("/:id")
    .get( wrapAsync(listingController.showRouteListing))     // show route
    .put( isLoggedIn, isOwnerListing,upload.single("listingKeyUpdate[image]"), wrapAsync(listingController.updateListing))    // update route
    .delete( isLoggedIn,isOwnerListing, wrapAsync(listingController.deleteListing));



 
// show route and edit route are same, in both the case we fetched the detailes of single listing from "Listing" collection through "Listingmodel schema" and then render those detailes in show.ejs page and edit.ejs form respectively
 router.get("/:id/edit",isLoggedIn,isOwnerListing, wrapAsync(listingController.renderEditForm))
 
 


module.exports = router;



















// show Route
//  router.get("/:id", wrapAsync(async (req,res) => {
//      let {id} = req.params;
//      const listingindividual = await Listingmodel.findById(id).populate("reviewsAll").populate("ownerListing"); // it will fetch single listing by id and then stored its detailes into "listingindividiual". here we have used ( populate("reviewsAll") ) , which will convert the "objectId" of all the "reviews" of "reviewschema" which is stored as "objectId" inside "reviewsAll array" of "listingschema" into "complete information" .                                                                                simillarly "populate("ownerListing")" will convert the "objectId" of all the "User" of "userschema" which is stored as "objectId" inside "ownerListing array" of "listingschema" into "complete information" . 


//      if(!listingindividual) {  //if only this particular "listingindividual" exist, then show error message and redirect to index.ejs page.
//         req.flash("error", "Listing you are looking for does not exist");
//         res.redirect("/listingmodel")
//      }


//      res.render("listings/show.ejs", {listingindividual});
//  }))











 // Create Route
 
 // app.post("/listingmodel", wrapAsync( async (req,res) => {  
 
     // const listingnew1 = req.body.listingKey;       // here using "req.body.Listingkey" we fetched all the input field values from "new.ejs form" 
 
     // const listingnew = new Listingmodel(req.body.listingKey);  // to convert all the fetched input field values into our defined schema, we used "Listingmodel" schema as  "new Listingmodel(req.body.listingkey)"  and stored them into "listingnew" variable.
     // await listingnew.save();
     // res.redirect("/listingmodel");  // here we are redirecting the data saved into "listingnew" to the "/listingmodel" route 
 // })
 // );