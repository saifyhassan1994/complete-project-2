const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listinghouse = require("../models/listing.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/AIRBNB');
  }
  main()
  .then((res)=>{
      console.log("connection successfull");
  })
  .catch((err) =>{
      console.log(err);
  });




const initdb = async()=>{
    await Listinghouse.deleteMany({});  // first it will empty 'Listing' collection 
    
    initdata.data = initdata.data.map( (obj) => ( {...obj,  ownerListing: "662fc14029f0802425d63df0"} ) );  // here we are inserting single owner or user for all the "initdata.data" listings using "map" method. map method will create a new array for "ownerListing" and then will add this array into "initdata.data".  here "initdata.data" is the variable inside which we had saved all the listings in "data.js" page. 

          //    _id: ObjectId("662fc627439d45d3892bf1bf"),
          // title: 'Historic Villa ',
          //description: 'Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.',
          //image: 'https://images.unsplash.com/photo-1682687982093-4773cb0dbc2e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          //price: 2500,
          //location: 'Florence',
          //country: 'Italy',
          //reviewsAll: [],

          //ownerListing: ObjectId("662fc14029f0802425d63df0"),    //this is how map function will insert "ownerListing" object inside "initdata.data".

          //__v: 0 


    await Listinghouse.insertMany(initdata.data); // Here it will insert datas in Listing collection(Listing collectin we have created inside listing.js schema). Here in (initdata.data) , data is a key from data.js file in which we have stored all the datas as (data: sampleListings).
    console.log("data was initialized");
}



initdb();       // run "node index.js" in terminal to insert all datas