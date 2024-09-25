const mongoose = require("mongoose");
const Schema = mongoose.Schema;                // Schema is a class which defines the shape of the document within the collection

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type: Number,
        min: 1,
        max: 5
        
    } ,
    createdAt: {
        type: Date,
        default: Date.now(),   // this will set the current date of the document as when the document was created.
    },
    ownerReviews: {
        type: Schema.Types.ObjectId,
        ref: "User",        // "User" is collection of "userSchema". here we are associating the owner with each review created by user who has created the individual review.
    }
    
    
});

module.exports = mongoose.model("Review", reviewSchema);      // here "model" is  a class with which we construct a document
                                     