
const mongoose = require("mongoose");
const Schema = mongoose.Schema;                
const ReviewSchema = require("./review.js");


const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    } ,
    description: String,
    

    
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
    category: {
        type: String,
        enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools'],
        
    }

});






listingSchema.post("findOneAndDelete", async (listingdata) => {
    if (listingdata) {
        await ReviewSchema.deleteMany({ _id: { $in: listingdata.reviewsAll}});  
    }
});



const Listingmodel = mongoose.model("Listing", listingSchema);     
module.exports = Listingmodel;                                      
                                                              