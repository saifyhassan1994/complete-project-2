const Listingmodel = require("../models/listing.js");
const Reviewmodel = require("../models/review.js");



// create or post route of reviews

module.exports.postReview = async (req,res) => {
    let individualListing = await Listingmodel.findById(req.params.id);// first finding "single listing" and stored it into "singleListing" variable.
    let newReview = new Reviewmodel(req.body.reviewKey);// then fetching datas from "review form" which was submitted by the user and convert it into "Reviewmodel" and then stored these into "newReview" variable.

    newReview.ownerReviews = req.user._id; // Since  "req.user"  has  " _id, email and username "  of current user who will create this new review, but here we only need "_id" of "current user" from "req.user". Thats why we write "req.user._id"

    // here we are trying to store our "current user Id" inside "ownerReviews" array of "newReview". "newReview" is the new review that will be created by "current user" or "currently loggedin user". We know that "passport" saves all the user related information inside "req" object as "req.user" , and inside "req.user" we have a property called "_id" which has the access of "current user Id".

    // so "req.user._id" will store the "id" of currently loggedIn user inside "ownerReviews" field. And so this "id" of currently loggedIn user will become the owner of our new review. that is now we will have the "id" of owner who has created new review. inorder to fetch information from this "id", we will use populate method. So now whenever we will create a new review, an owner will be associated with each review who are creating these reviews.

    // console.log(newReview);
    individualListing.reviewsAll.push(newReview);// then we will push datas stored in "newReview" into "reviewsAll" array of "listingSchema" and then will add these datas of "reviewsAll" to "singleListing".
    await newReview.save();
    await individualListing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listingmodel/${individualListing._id}`)
}







// delete route of reviews

module.exports.deleteReview = async(req, res) => {

    let {id, reviewId} = req.params;  // here "id" is the id of listingschema and "reviewId" is the id of reviewschema

    await Listingmodel.findByIdAndUpdate(id, {$pull: {reviewsAll: reviewId}}) // this is to delete "reviewsObjectId" which was stored inside "reviewsAll array" of listingschema.here "pull" means remove or delete. here it will delete or pull the "single review" using its id as "reviewId" from "reviewsAll" array, and then will update this "particular listing" after deleting each "single reviews".

    await Reviewmodel.findByIdAndDelete(reviewId); // this is to delete reviews from "Review collection" of reviewschema

    req.flash("success", "Review Deleted"); // this message will pop up after we delete each route

    res.redirect(`/listingmodel/${id}`) 
}
