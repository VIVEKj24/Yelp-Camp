const e = require('connect-flash');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync')
const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary');  // Import Cloudinary storage setup
const upload = multer({ storage });  // Create multer instance with Cloudinary storage
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
    }
    catch (e) {
        req.flash('error',e.message)
    }
}

module.exports.search = async (req, res) => {
    const { query } = req.query; // Extract the query parameter
    if (!query) {
        return res.json({ results: [] }); // Return an empty result if query is missing
    }
    try {
        const campgrounds = await Campground.fuzzySearch(query); // Perform fuzzy search
        res.json({ results: campgrounds }); // Return the results

    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
}
module.exports.newRender = (req, res) => {
    res.render('campgrounds/new')
}
module.exports.newPost = catchAsync(async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
    if(geoData.features!=[]){
    console.log(req.body)
    const campground = new Campground(req.body);
    campground.geometry = geoData.features[0].geometry;
    
    campground.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully Created a new CampGround!!')
    res.redirect(`/campgrounds/${campground._id}`)}
    else{
        req.flash('error','Invalid Location!')
       return  res.redirect('/campgrounds/new')
    }
})
module.exports.editName = (req, res) => {
    res.render('campgrounds/EditByName')
}
module.exports.editNamePost =  catchAsync(async (req, res) => {
    const { title } = req.body
    // const c = await Campground.find({title: { $regex: `${req.body.title}`, $options: "i"}})// used to find camps. lowercase//
    const c = await Campground.fuzzySearch(title)

    if (c.length === 0) {
        return res.redirect('/campgrounds')
    }
    else {
        const foundObj = c[0]._id.toHexString()
        res.redirect(`/campgrounds/${foundObj}/edit`)
    }
})

module.exports.show = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot Find Campground!')
        return res.redirect('/campgrounds')
    }
    // to show reviews made by current user..
    const youreviews=[] 
    if (req.user){
    for (let rv of campground.reviews){ 
    if(rv.author._id.equals(req.user._id)){ 
    youreviews.push(rv) 
    }}
    return res.render('campgrounds/show', { campground,youreviews, mainBody: res.locals.mainBody}) }
    return res.render('campgrounds/show', { campground})
})
module.exports.editRender = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot Find Campground!')
        return res.redirect('/campgrounds')
    }
    return res.render('campgrounds/edit', { campground })
})
module.exports.editPost = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body)
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    await campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename)
            .then(console.log('deleted success'))
            .catch((e)=>console.log(e))
        }
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})}
    req.flash('success', 'Successfully Edited the Canpground!!')
    res.redirect(`/campgrounds/${id}`)
})
module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted!')

    res.redirect('/campgrounds')
})
module.exports.imgUpload = upload.array('image'), (req, res,next) => {
    try {
        if (req.files) {
            // console.log({ message: 'File uploaded successfully', imageUrl: req.files.path }); 
            next() // Respond with the Cloudinary image URL
        } else {
            // console.log('File upload failed');
            res.status(400).send('No file uploaded');  // Handle case where no file is uploaded
        }
    } catch (error) {
        // console.error('Error during file upload:', error);  // Log any errors
        res.status(500).send('Internal Server Error');
    }
}