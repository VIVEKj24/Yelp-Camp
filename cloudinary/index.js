const cloudinary = require('cloudinary').v2;  // Ensure you are using the v2 API
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  // Replace with your actual Cloudinary cloud name
    api_key: process.env.CLOUD_API_KEY,  // Replace with your Cloudinary API key
    api_secret: process.env.CLOUD_API_SECRET,  // Replace with your Cloudinary API secret
});

// console.log('Cloudinary Config:', cloudinary.config());  // This will log the configuration to verify

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'Yelpcamp',  // Folder where images will be stored
      allowedFormats: ['jpeg', 'png', 'jpg'],  // Supported formats
    },
});

module.exports = {
    cloudinary, 
    storage
};
