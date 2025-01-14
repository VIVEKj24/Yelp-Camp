const express = require('express')
const router = express.Router();
const { validateCampground, validatebyname } = require('../utils/validation')
const { isLoggedIn, storeCredentials, giveCredentials } = require('../middleware')
const { isAuthor,isRevAuthor } = require('../middleware');
const campground = require('../controllers/campground');
const reviews = require('../controllers/reviews')

router.route('/')
    .get(campground.index)
    .post(isLoggedIn,campground.imgUpload,validateCampground, campground.newPost)  // Add other middlewares as needed
    

//search route//
router.get('/search', campground.search);
//new route// put this route before show route ,{trigger show route , the req.params will take anything as id}
router.get('/new', isLoggedIn, campground.newRender)

//edit by name // put this route before show route ,{trigger show route},the req.params will take anything as id}
router.route('/editbytitle')
    .get( isLoggedIn, campground.editName)
    .post(isLoggedIn, validatebyname, campground.editNamePost)

//show route
router.get('/:id',isLoggedIn, campground.show)
//new reviews
router.post('/:id',isLoggedIn,reviews.reviewPost)

// delete route for REviews
// we need to delete both from the camp and review schema, we need both ids's
router.delete('/:id/reviews/:reviewId', isLoggedIn,isRevAuthor, reviews.reviewDelete)
//ALTER METHOD((more efficient)) :$pull operator: await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}})

//edit route
router.get('/:id/edit', isAuthor, campground.editRender)
router.put('/:id', isLoggedIn, isAuthor,campground.imgUpload,validateCampground, campground.editPost)

//delete route
router.delete('/:id', isLoggedIn, isAuthor, campground.deleteCampground)


module.exports = router;