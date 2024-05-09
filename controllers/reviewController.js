const Listingmodel = require("../models/listing.js");
const Reviewmodel = require("../models/review.js");



// create or post route of reviews

module.exports.postReview = async (req,res) => {
    let listingReviews = await Listingmodel.findById(req.params.id);
    let newReview = new Reviewmodel(req.body.reviewKey);

    newReview.ownerReviews = req.user._id; // Since  "req.user"  has  " _id, email and username "  of current user who will create this new review, but here we only need "_id" of "current user" from "req.user". Thats why we write "req.user._id"

    // here we are trying to store our "current user Id" inside "ownerReviews" array of "newReview". "newReview" is the new review that will be created by "current user" or "currently loggedin user". We know that "passport" saves all the user related information inside "req" object as "req.user" , and inside "req.user" we have a property called "_id" which has the access of "current user Id".

    // so "req.user._id" will store the "id" of currently loggedIn user inside "ownerReviews" field. And so this "id" of currently loggedIn user will become the owner of our new review. that is now we will have the "id" of owner who has created new review. inorder to fetch information from this "id", we will use populate method. So now whenever we will create a new review, an owner will be associated with each review who are creating these reviews.

    console.log(newReview);
    listingReviews.reviewsAll.push(newReview);
    await newReview.save();
    await listingReviews.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listingmodel/${listingReviews._id}`)
}







// delete route of reviews

module.exports.deleteReview = async(req, res) => {

    let {id, reviewId} = req.params;  // here "id" is the id of listingschema and "reviewId" is the id of reviewschema

    await Listingmodel.findByIdAndUpdate(id, {$pull: {reviewsAll: reviewId}}) // this is to delete "reviewsObjectId" which was stored inside "reviewsAll array" of listingschema.

    await Reviewmodel.findByIdAndDelete(reviewId); // this is to delete reviews from "Review collection" of reviewschema

    req.flash("success", "Review Deleted"); // this message will pop up after we delete each route

    res.redirect(`/listingmodel/${id}`) 
}
