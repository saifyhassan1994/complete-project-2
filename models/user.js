const mongoose = require("mongoose");
const Schema = mongoose.Schema;                // Schema is a class which defines the shape of the document within the collection
const passportLocalMongoose = require("passport-local-mongoose");  // "passport-local-mongoose" will automatically add "username" and "password" and also hashing password, therefore we dont need to define a separate field for "username" and "password" in our schema.It will also add some another method such as "authenticate()" , "serializeUser()"  e.t.c .

const userSchema = new Schema({

    email:{
        type: String,
        required: true,
    } ,
   
    
});

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", userSchema);  