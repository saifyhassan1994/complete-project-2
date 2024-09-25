if(process.env.NODE_ENV != "production") { 

   require('dotenv').config();  
   
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ExpressError = require("./Errorhandle/ExpressError.js");



const session = require("express-session");  
const MongoStore = require('connect-mongo'); 

const flash = require("connect-flash");  
const passport = require("passport"); 
const LocalStrategy = require("passport-local"); 
const userSchema = require("./models/user.js");

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));     

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");    
app.engine("ejs", ejsMate); 

app.use(express.static(path.join(__dirname, "/public")));   





 const MONGO_URL = "mongodb://127.0.0.1:27017/AIRBNB";
// const dbUrl = process.env.ATLASDB_URL
async function main() {
    await mongoose.connect(MONGO_URL);
    // await mongoose.connect(dbUrl);
  }

 main()
  .then(()=>{
      console.log("connection to DB successfull");
  })
  .catch((err) =>{
      console.log(err);
  });







const sessionOptions = {       
    secret: process.env.SECRET,   
    resave: false,             
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,     
    },
};





app.use(session(sessionOptions));  // we must use "session" and "flash" before our "routes".
app.use(flash());



// we always use our "passport" middleware just after our "session" middleware, because "login" and "signUp" method will comes under "session" , thats why "passport" also used "session" .
app.use(passport.initialize());  // this is to initialize passport as a middleware.
app.use(passport.session());  // this is to identify that, weather its the same user who is browsing from one page to other or different user. The user should only login once during one session, that is the user does not have to login again and again if its browsing from page to another during one session.  ( the series of requests and responses each associated with the same user is known as session )
passport.use(new LocalStrategy(userSchema.authenticate())); // all the "User" of "userSchema" should be authenticate through "Localstrategy" inside "passport". Authenticate is used to help User in login and signUp.

passport.serializeUser(userSchema.serializeUser()); // stores user related information inside session.
passport.deserializeUser(userSchema.deserializeUser()); // unstore user related information from session. that is when session will end, we need to delete all the information of the user related to its session.






app.use((req, res, next) => {
    res.locals.successLocal = req.flash("success");
    res.locals.errorVariable = req.flash("error");
    res.locals.currUser = req.user;  // here passport will automatically stored all the information related to "currently loggedIn user",  inside "req.user", which we have stored in "currUser" variable, and then we have saved "currUser" inside "locals" to acess "currUser" anywhere we want.
    next();
});







const listingRoute = require("./routes/listingRoute.js")
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");
// const { cookie } = require("express/lib/response.js");














app.use("/listingmodel", listingRoute);              // in listingRoute we have replaced "/listingmodel"  into "/"
app.use("/listingmodel/:id/reviews/", reviewRoute);  // in reviewRoute we have replaced "/listingmodel/:id/reviews/"  into "/"
app.use("/", userRoute);  




// send total value of cart to proceed.ejs page

app.post('/listingmodel/proceed', (req, res) => {
    const finalTotal1 = req.body.finalTotal;
    res.render('listings/proceed.ejs', { finalTotal1 });
});







app.all("*", (req, res, next) => {          // this will check for all the routes above and if none of the route match with the route we have tried to find in the browser , then it will throw the error "page not found"
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {            // for both wrapAsync and ExpressError
    let {statusCode = 500, message ="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});




app.listen(8080, () =>{
    console.log('server is listning')
});


















// Demo to check passport implementation for login and signUp
// app.get("/demouser", async (req,res) => {
//     let fakeUser = new userSchema({
//          email: "student@gmail.com",
//          username: "delta-student",   // in "userschema" we did not define "username" field because it was automatically added in the "userschema" .
    // });

    // let registeredUser = await userSchema.register(fakeUser, "helloworld");  // "register" is a method which wll register our "fakeUser" with  "helloworld" password, and it also autometically checks that weather our "username" is unique or not with respected to database.
//     res.send(registeredUser);

// });



// Error handler

// app.use((err, req, res, next) => {        //  for wrapAsync only
//     res.send("something went wrong");
// });
