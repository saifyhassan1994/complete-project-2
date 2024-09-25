const userSchema = require("../models/user.js");


// get route for signUp form for user

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}





// post route for signUp form for user

module.exports.signUp = async(req, res) => {

    try{
        let {username, email, password} = req.body;      // fetching all the input fields of signup form
        const newUser = new userSchema({email, username}); // storing fetched email and username inside userschema and saved into "newUser"
        const registeredUser = await userSchema.register(newUser, password); // now we will register "newUser" with its password that we had fetched above along with "username" and "email".  
        // console.log(registeredUser);

             req.login(registeredUser, (err) => {    // to automatically login "registeredUser" after successfully signup. 

                        //  "req.login" is a method which automatically logged in the user. "req.login" asks for the user whom we want to be loggedin. here "registeredUser" is the user whom we want to be autometically log in as soon as it successfully signup. it happens because as soon as the user signUp, all the information related this user will be accessed by "req.login", and then based on this information "req.login" method will automatically loggedin this user. 

                    if(err){
                                return next(err);
                    }

            req.flash("success", "Welcome To AIRBNB");  // this is the else condition, that is if successfully loggedin using "req.login" then
            res.redirect("/listingmodel");
        });

    }catch(e){
            req.flash("error", e.message);
            res.redirect("/signup");   // if an error occur , we will redirect to "signup" page along with a flash error message. 
    };
   
};







// get route for login form for user

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}




// post route for login form for user

module.exports.logIn = async(req, res) => {

    req.flash("success", "welcome back to AIRBNB!"); // this message will appear after user login.
    let redirectUrlnew = res.locals.redirectUrl2 || "/listingmodel"   // if "redirectUrl" exist then only save this                  "res.locals.redirectUrl" into "redirectUrlnew" variable or else save "/listingmodel" into "redirectUrlnew" variable.
    res.redirect(redirectUrlnew); // if "res.locals.redirectUrl" exist then we will redirect to "redirectUrl" path else we will redirect to "/listingmodel" path.

    // how "redirectUrl" understand that which path we are trying to access. it is when we first try to access our "create new listing" page without "logging in" ,then this is where "redirectUrl" will acess "create new listing" path, so as soon as we logged in , "redirectUrl" will redirect us to the "create new listing"  page. same case will happen if we try to edit a listing without logging, then in this case "redirectUrl" will acess the edit path, and soon as we logged in , "redirectUrl" will redirect us to the "edit"  page.

    // if we first logged in from "login" option and then click on "create new listing" , then there wont be any path which "redirectUrl"  needs to acess, and in that case we will be redirected to the "/listingmodel" path.


};






// logout route for user

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {       // "req.logout" is a method in passport which will delete our user fro current session which will force user to loggedout.
        if(err){
           return  next(err);
        }
        req.flash("success", "you are logged out now");
        res.redirect("/listingmodel");
    })
}
