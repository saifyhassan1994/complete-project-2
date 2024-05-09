const express = require("express");
const router = express.Router();
const wrapAsync = require("../Errorhandle/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/userController.js") // middleware for routes of user



router
    .route("/signup")
    .get( userController.renderSignUpForm)
    .post( wrapAsync(userController.signUp));



// signUp form

// get route for signUp form
// router.get("/signup", userController.renderSignUpForm);



// post route for signUp form
// router.post("/signup", wrapAsync(userController.signUp));




router
    .route("/login")
    .get( userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login',failureFlash:true }), userController.logIn);




// Login Form

// get route for login form
// router.get("/login", userController.renderLoginForm);





// post route for login form

// "passport.authenticate"  middleware is the method which will authenticate our user, that is to check wether the user is already exist in our database or not. In this first we will define our strategy which is "local". then we will give "failureRedirect" option which says if user authentication failed, that is if user provide the username or password which does not exist in our database, then in that case our user will be again redirect to our login page. then we will give second option "failureFlash" which will flash some message if user authentication failed. 

// "saveRedirectUrl" is the middleware in which we have saved "redirectUrl" in which our "originalUrl" exist. this "redirectUrl" or "originalUrl" is the url where we want to redirect after loggedin. 
//  router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login',failureFlash:true }), userController.logIn);






// Logout route
router.get("/logout", userController.logOut)

module.exports = router;