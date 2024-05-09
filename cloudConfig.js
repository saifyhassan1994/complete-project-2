const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({                         // to connect our backened with our cloudinary account
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({  // this "storage" is the storage where we will store our file after uploading it in the cloudinary
    cloudinary: cloudinary,
    params: {
      folder: 'AIRBNB_DEV',     // here we will give any folder name
      allowedFormat: ["png", "jpg", "jpeg"], // here we will define our file formats including "pdf", "doc" e.t.c
    },
  });

  

  module.exports = {
    cloudinary,
    storage,
  };