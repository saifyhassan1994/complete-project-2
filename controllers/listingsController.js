const Listingmodel = require("../models/listing.js");

// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/tilesets');  // for geocoding of map
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');  // replace "tilesets" with "geocoding".

const mapToken = process.env.MAP_TOKEN  // accessing "MAP_TOKEN" from .env file
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



// index route of listing

module.exports.indexRouteListing = async (req,res) => {
    const allListings = await Listingmodel.find({});   // All the listings we had inserted into our Listing collection of listingSchema through index.js which we have required here as Listingmodel, so now all the datas are now accessed inside Listingmodel
    res.render("listings/index.ejs", {allListings}); // here "Listingmodel.find" will fetch all datas and stored into "allListing" which we have rendered into "index.ejs" page.
 }





// new route of listing

module.exports.renderNewForm = (req,res) => {  // "isLoggedIn" is a middleware we have created in "middleware.js" which checks weather user is authenticated or not while we try to log in, that is weather the user is already exist in the database or not.
    res.render('listings/new.ejs')
}





// show route of listing

module.exports.showRouteListing = async (req,res) => {
    let {id} = req.params;
    const listingindividual = await Listingmodel.findById(id).populate({path: "reviewsAll", populate:{path: "ownerReviews"},}).populate("ownerListing"); 

    // here "populate({path: "reviewsAll", populate:{path: ownerReviews},})" means first it will populate "ownerReviews" which is a field of reviewshema and then it will populate "reviewsAll" which is a field of listingschema.From "ownerReviews" we will convert ObjectId of "User" of userschema and then from "reviewsAll" we will convert ObjectId of "Reviews" of reviewschema. 
    
    
    // "Listingmodel.findById(id)" will fetch single listing by "id" and then stored its detailes into "listingindividiual". here we have used ( populate("reviewsAll") ) , which will convert the "objectId" of all the "reviews" of "reviewschema" which is stored as "objectId" inside "reviewsAll array" of "listingschema" into "complete information". simillarly "populate("ownerListing")" will convert the "objectId" of all the "User" of "userschema" which is stored as "objectId" inside "ownerListing array" of "listingschema" into "complete information" . 


    if(!listingindividual) {  //if only this particular "listingindividual" exist, then show error message and redirect to index.ejs page.
       req.flash("error", "Listing you are looking for does not exist");
       res.redirect("/listingmodel")
    }


    res.render("listings/show.ejs", {listingindividual});
}







// create or post route of listing

module.exports.createNewListing = async (req, res, next) => { 

    let response = await geocodingClient.forwardGeocode({   // map
        query: req.body.listingKey.location,   // "listingKey.location" we have fetched from new.ejs form of "location field".
        limit: 1, // "only one possible coordinates"
      })
    .send();

        
       
    
    const listingnew = new Listingmodel(req.body.listingKey);  


    let url = req.file.path;    // inside "req.file" we have both "path" and "filename" , here "path" is the path or link of image from cloudinary and "filename" is the filename of image from cloudinary. also we have added "url" and "filename" inside image field of listingschema.
    let filename = req.file.filename;
    listingnew.image = {url, filename};


    listingnew.geometry = response.body.features[0].geometry;  // saving coordinates inside "geometry field" to save in "listingnew".
    

    listingnew.ownerListing = req.user._id;  // Since  "req.user"  has  " _id, email and username "  of current user who will create this new listing, but here we only need "_id" of "current user" from "req.user". Thats why we write "req.user._id"

    // here we are trying to store our "current user Id" inside "ownerListing" array of "listingnew". "listingnew" is the new listing that will be created by "current user" or "currently loggedin user". We know that "passport" saves all the user related information inside "req" object as "req.user" , and inside "req.user" we have a property called "_id" which has the access of "current user Id".

    // so "req.user._id" will store the "id" of currently loggedIn user inside "ownerListing" field. And so this "id" of currently loggedIn user will become the owner of our new listing. that is now we will have the "id" of owner who has created new listing. inorder to fetch information from this "id", we will use populate method. So now whenever we will create a new listing, an owner will be associated with each listing who are creating these listings.

    
    
    await listingnew.save();


    req.flash("success", "New Listing Created"); // show this message after every listing will be created.

    res.redirect("/listingmodel");  
}






// edit route of listing

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listingEdit = await Listingmodel.findById(id);  //here find by id will fetch all the detailes of particular listing on which we click and then will store all the fetched detailes into "listingEdit"

    if(!listingEdit) {
       req.flash("error", "Listing you are looking for does not exist");
       res.redirect("/listingmodel")
    }


    // for edit image preview from cloudinary url
    let originalImageUrl = listingEdit.image.url;   // here first we are fetching the "existing image url" from our "listingEdit".  
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250") // then we will "replace" "existing image url" with new design provided by cloudinary itself. here "("/upload", "/upload/w_250")"  means we are replacing "/upload" from existing or original image url with "/upload/w_250" design. here "w_250" means width 250.


    res.render("listings/edit.ejs", {listingEdit, originalImageUrl});  // here we have provided detailes stored into "listingEdit" to "edit.ejs" form 

}







// update route of listing

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listingUpdate = await Listingmodel.findByIdAndUpdate(id, {...req.body.listingKeyUpdate});  // it will pass new updated value inside "Listingmodel schema".


    if (typeof req.file !== "undefined") {  // here we have defined a condition that , if only we have a new image to update, then only we will perform these condition. this condition says that, if there is a file or image exit, which means it is not "undefined", then in that case perform below condition. 

        let url = req.file.path;    // inside "req.file" we have both "path" and "filename" , here "path" is the path or link of image from cloudinary and "filename" is the filename of image from cloudinary. also we have added "url" and "filename" inside image field of listingschema.
        let filename = req.file.filename;
        listingUpdate.image = {url, filename};

        await listingUpdate.save();

    }

    // res.redirect("/listingmodel");  // here we have redirected after updating to "index route"

    req.flash("success", " Listing Updated");

    res.redirect(`/listingmodel/${id}`);  // here we have redirected  to "show route" after updating
    
}






// delete route of listing

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
     await Listingmodel.findByIdAndDelete(id); 

     req.flash("success", " Listing Deleted Successfully ");
     
    res.redirect("/listingmodel");
}