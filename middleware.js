const Campground = require('./models/campground')
const Review = require('./models/review')
module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You Must Be Signed In First!!')
        return res.redirect('/login')
    }
    next()
}

// after login user should redirect to page which it be viweing without login
module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next()
}
module.exports.isAuthor = async(req,res,next)=>{
    const {id}= req.params
    const campground = await Campground.findById(id)
    if(req.user){
        if(!campground.author[0].equals(req.user._id)){
            req.flash('error','You have No Permission to THAT!!')
            return res.redirect(`/campgrounds/${id}`)
        }
            next();}else{
     req.flash('error','You Must Be Signed In First!!')
    return  res.redirect(`/campgrounds/${id}`)}

}
module.exports.isRevAuthor =async(req,res,next)=>{
    const {id ,reviewId}= req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You have No Permission to THAT!!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();


}