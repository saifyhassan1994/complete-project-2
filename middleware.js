const Listingmodel = require("./models/listing.js");
const Reviewmodel = require("./models/review.js");
const ExpressError = require("./Errorhandle/ExpressError.js");
const {listingSchemaValidationMethod, reviewSchemaValidationMethod} = require("./schema.js");



// to check if the user is loggedIn or not
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {   // as soon as user loggedin, user related information will be automatically stored into "req", and then this user related information triggers "isAuthenticated" to check weather our user is authenticated or not.
    //"req.isAuthenticated" is a method which checks that weather our user is authenticated or not. if this method returns true then that means that our user is authenticated,and if it returns falls then we will show the error and then redirect user to the        "/login".
        
        req.session.redirectUrl = req.originalUrl;  //we only want to save "originalUrl", if user is not loggedIn. this condition runs when "isAuthenticated" method returns true. Here we have saved "originalUrl" inside "redirectUrl" variable and then saved "redirectUrl" inside "req.session". Later we will save "req.session.redirectUrl" inside "local" inorder to access it anywhere we want.   "originalUrl" is a method of "req" object. that is inside "req", there is a property called "originalUrl" in which that path will be saved which we were originally wanted to access. for example if we had clicked on "add new listing" page first, but instead we were redirected to any other page for example login page. so in this case "add new listing" path is the path which we wanted to access first and not login page. therefore inside "originalUrl", this "add new listing" path will be saved.

       


        req.flash("error", "you must be loggedin to create Listing"); //this condition runs when "isAuthenticated" method returns false.

        return res.redirect("/login"); //this condition runs when "isAuthenticated" method returns false. that is this is the path where we want to redirect if the user is not logged in.

    }
    next();
};


// to save redirectUrl into "locals" to access it anywhere
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {     // this condition defines that if there is any "redirectUrl" inside "req.session" then we will save this "redirectUrl" into "locals" as "res.locals.redirectUrl" .
        res.locals.redirectUrl2 = req.session.redirectUrl;
    }
    next();
}; 






// to check if the user is the owner of the listing or not, who is trying to delete the listing

module.exports.isOwnerListing = async(req, res, next) =>{
    let {id} = req.params;
    let individualListing = await Listingmodel.findById(id); 
    if(!individualListing.ownerListing._id.equals(res.locals.currUser._id)) {    // this condition check if the owner of the listing is same or not as the one who is currently loggedIn. if currently loggedin user is not the owner of the listing, then in that case this "isOwnerListing" middleware will stop currently loggedIn user from editing or deleting the listing. we have applied this "isOwnerListing" middleware to edit, delete and update routs of listingRoute.
    // inside "ownerListing" we had already stored id of currently logged in user before creating new listing using "req.user._id" inside create route of listing. so that every newly created listing will have the id of user who has created this listing
    // "currUser" is the variable in which populate method has stored all the information of currently logged in user using "req.user" inside "app.js"
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listingmodel/${id}`);
    }
    next();
};







// to check if the user is the one who has created this review or not, who is trying to delete the review

module.exports.isOwnerReview = async(req, res, next) =>{
    let {id, reviewId} = req.params;
    let review = await Reviewmodel.findById(reviewId); 
    if(!review.ownerReviews._id.equals(res.locals.currUser._id)) {    // this condition check if the owner of the review is same or not as the one who is currently loggedIn. if currently loggedin user is not the owner or the one who has created this review, then in that case this "isOwnerReview" middleware will stop currently loggedIn user from deleting the review. we have applied this "isOwnerReview" middleware to delete route of reviewRoute.

    // we have inserted "current user id" inside "ownerReviews" before saving new review in post route of review, so that now this current user becomes the owner of this review who is creating this review.

    //inside "currUser" variable we have inserted the id of user who is currently logged in to our web page.
        req.flash("error", "you are not the owner of this review");
        return res.redirect(`/listingmodel/${id}`);
    }
    next();
};











// validateListing Function for listingSchema

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchemaValidationMethod.validate(req.body);  // it will check weather "req.body" is satisfied or validate based on the conditions we have created inside "listingSchemaValidationMethod".
    if(error){    // if we get any error inside "{error}" from "listingSchemaValidationMethod.validate(req.body)", then we will throw a new "ExpressError"
        let errMsg = error.detailes.map((el) => el.message).join(",");  // here this will collect all the detailes we get inside "error" and then join and seperate all the detailes using "," .
        throw new ExpressError(400, errMsg);
    }else{
        next();  // or if we dont get any error , then we will call our next();
    }
  };






// validateReview Function for reviewSchema

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchemaValidationMethod.validate(req.body);  
    if(error){    
        let errMsg = error.detailes.map((el) => el.message).join(",");  
        throw new ExpressError(400, errMsg);
    }else{
        next();  
    }
  };













// just to check user authentication, that is weather the user is already exist in the database or not who is trying to login. 

// module.exports.isLoggedIn = (req, res, next) => {
//     if(!req.isAuthenticated()) {   // as soon as user loggedin, user related information will be automatically stored into "req", and then this user related information triggers "isAuthenticated" to check weather our user is authenticated or not.

//        //  "req.isAuthenticated" is a method which checks that weather our user is authenticated or not. if this method returns true then that means that our user is authenticated, and if it returns falls then in that case we have defined conditin below as, 

//         req.flash("error", "you must be loggedin to create Listing");
//         return res.redirect("/login");

//     }
//     next();
// }