// const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;                // Schema is a class which defines the shape of the document within the collection
const ReviewSchema = require("./review.js");
const { ref } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    } ,
    description: String,
    

    // to save image link we have got from cloudinary inside database, we need to save "url" and "filename" inside image
    image: {

      url: String,
      filename: String,

    },

    price: Number,
    location: String,
    country: String,
    reviewsAll: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",                    // "Review" is collection of "reviewSchema"
        }
    ],
    ownerListing:{
        type: Schema.Types.ObjectId,
        ref: "User",                           // "User" is collection of "userSchema"
    },
    geometry: {   // this is geojson format to store coordinates
        type: {
          type: String,
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number], // since we want to store the cooordinates of longitude and latitude which is two numbers thats why we will array to store two numbers.
          required: true,
        },
      }, 
});





// for deleting all the reviews of particular listing, when deleting the listing itself. that is when we delete a listing, all the reviews of that listing will also gets deleted.

// this "post" method is a middleware which will activate only after the deletion of listing. that is as soon as we delete listing, this middleware will activate and all the information of the deleted listing will gets stored into "listingdata". 
listingSchema.post("findOneAndDelete", async (listingdata) => {
    if (listingdata) {
        await ReviewSchema.deleteMany({ _id: { $in: listingdata.reviewsAll}});  // this condition says that all the reviewsId, related to deleted listing, which was stored in "reviewsAll array" of listingschema, will also gets deleted from "reviewschema". 
    }
});



const Listingmodel = mongoose.model("Listing", listingSchema);      // here "model" is  a class with which we construct a document
module.exports = Listingmodel;                                      // here "Listing" is the name of "collection" which always start with capital letter
                                                               // here "ListingModel" is the name of "model"
                                                               // Usually we keep the "model" and "collection" name same