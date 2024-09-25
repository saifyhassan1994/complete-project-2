const Listingmodel = require("../models/listing.js");


// index route of listing

module.exports.indexRouteListing = async (req,res) => {
    const allListings = await Listingmodel.find({});   // All the listings we had inserted into our Listing collection of listingSchema through index.js which we have required here as Listingmodel, so now all the datas are now accessed inside Listingmodel
    res.render("listings/index.ejs", {allListings}); // here "Listingmodel.find" will fetch all datas and stored into "allListing" which we have rendered into "index.ejs" page.
 }

 



// new route of listing
 // New route(it will fetch a form to create new listing),  we must write "new route" before "show route" because of "id" or else we will get error. we had written this path "/listingmodel/new" which will fetch the "new form" inside "navbar" . 
module.exports.renderNewForm = (req,res) => {  
    res.render('listings/new.ejs')
}



// view cart route 
 
// module.exports.ViewCaertPage = async (req,res) => {  
//     if (!req.session.cart) {
//         req.session.cart = [];
//     }
//     const cartListings = await Listingmodel.find({ _id: { $in: req.session.cart } });
//     res.render("listings/cart.ejs", { cartListings });
// }



// view cart route for show page to add to cart page by selecting image size and color
module.exports.ViewCaertPage = async (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const cartListings = await Listingmodel.find({ _id: { $in: req.session.cart.map(item => item.id) } });

    // Add color and size to cartListings
    const updatedCartListings = cartListings.map((listing, index) => ({
        ...listing.toObject(),
        color: req.session.cart[index].color,
        size: req.session.cart[index].size
    }));

    res.render("listings/cart.ejs", { cartListings: updatedCartListings });
};













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
    

    listingnew.ownerListing = req.user._id; // since "ownerListing" already has the access of "objectId, email and username" of user from "userSchema". therefore inorder to associate current owner for each newly created listing,first we need to store "id" of currently loggedIn user(or owner) inside "ownerListing field" of "listingSchema" and then store this "ownerListing" inside "listingnew" or new listing we are going to create so that now "ownerListing" will have the "id" of currently loggedIn user with its email and username, so that now we will have the "username and email" of currently loggedIn user with its id. 

    //we had inserted reference of "userSchema" inside "ownerListing" field of "listingSchema".

   //now we konw that "populate" automatically stores all the the information related to currently loggedIn user inside "req.user" such as current users "id" and more. whenever we are creating new listing, we want to save information of current user inside this new listing. therefore inorder to get the currently loggedIn user who is going to create new listing, we will need its "id". so we will fetch current users id from "req.user._id" and then we will store this "id" inside "ownerListing" field of "listingSchema" and then we will associate this "ownerListing" with "listingnew" which we are going to create. now inside each new listing we are going to create, we will have the id of current user who are creating each particular new listing.


    
    
    await listingnew.save();


    req.flash("success", "New Listing Created"); // show this message after every listing will be created.

    res.redirect("/listingmodel");  
}





// Filter by Category Route
module.exports.categoryListing = async (req,res) => {
    const category = req.params.category;
    
        const listingCategory = await Listingmodel.find({ category });
        res.render("listings/index.ejs", { allListings: listingCategory });
    
}


// Add Cart  Route from main page or index page
// module.exports.AddCartRoute = async (req,res) => {
   
//     const { id } = req.params;
//     if (!req.session.cart) {
//         req.session.cart = [];
//     }
//     req.session.cart.push(id);
//     req.flash("success", "Item added to cart");
//     res.redirect("/listingmodel");
// }






// Add Cart  Route from show page by selecting images size and color
module.exports.AddCartRoute = async (req, res) => {
    const { id } = req.params;
    const { color, size } = req.body;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItem = {
        id: id,
        color: color,
        size: size
    };

    req.session.cart.push(cartItem);
    req.flash("success", "Item added to cart");
    res.redirect("/listingmodel");
};









// search function
module.exports.searchFunction = async (req,res) => {
    
    const { q } = req.query;
    const searchResults = await Listingmodel.find({
        $or: [
            { title: new RegExp(q, 'i') },
            { description: new RegExp(q, 'i') },
            { location: new RegExp(q, 'i') },
            { country: new RegExp(q, 'i') },
            { category: new RegExp(q, 'i') }
        ]
    });
    res.render("listings/index.ejs", { allListings: searchResults });

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




// delete route of cart listing

// module.exports.deleteCartListing = async (req,res) => {
//     const { id } = req.params; // This extracts the id parameter from the request URL. If the URL is /listingmodel/cart/12345, then id will be 12345. This allows you to identify which listing to remove from the cart.

//     if (req.session.cart) { // This checks if the cart property exists on the session object.  The session object stores data that persists across different requests from the same client.   If the cart property does not exist, it means there are no items in the cart.
       
//       req.session.cart = req.session.cart.filter(cartId => cartId !== id); // This line filters the cart array to remove the item with the ID that matches the id parameter. filter creates a new array containing only the items that do not match the given id.  After this operation, req.session.cart will no longer include the item with the specified id.
      
//      }
//     res.redirect("/listingmodel/cart");
// }



// delete route of cart listing

module.exports.deleteCartListing = async (req, res) => {
    const { id } = req.params;

    // Find the index of the item in the cart with the matching id
    const itemIndex = req.session.cart.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        // Remove the item from the cart if found
        req.session.cart.splice(itemIndex, 1);
    }

    // Optionally, add a flash message for user feedback
    req.flash("success", "Item removed from cart");

    // Redirect back to the cart page
    res.redirect('/listingmodel/cart');
};









// delete route of listing

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
     await Listingmodel.findByIdAndDelete(id); 

     req.flash("success", " Listing Deleted Successfully ");
     
    res.redirect("/listingmodel");
}