const Campground = require('../models/campground');
const Review = require('../models/review')

module.exports.reviewPost = async (req, res) => {
    
    const { rating, body } = req.body;
    const { id } = req.params;
    const UserID = req.user._id
    const Foundcampground = await Campground.findById(id)
    const UserReviews = new Review({ review: body, rating: rating, author: UserID })
    // console.log(UserReviews)
    Foundcampground.reviews.push(UserReviews)
    await UserReviews.save()
    await Foundcampground.save()
    req.flash('success', 'Successfully Added a new Review!!')

    res.redirect(`/campgrounds/${id}`)
}

module.exports.reviewDelete =  async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id)
    foundCamp.reviews = foundCamp.reviews.filter(
        (e) => e.toString() !== req.params.reviewId)// used toString because objectid datatype
    await foundCamp.save()
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success', 'Successfully Deleted the Review!!')

    res.redirect(`/campgrounds/${req.params.id}`)
}