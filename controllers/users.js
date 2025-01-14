const User = require('../models/user')

module.exports.registerGet = (req,res)=>{
    if(req.user){
        req.flash('error','User Already Logged In.')
        return res.redirect('/campgrounds')
    }
    res.render('users/register')
}

module.exports.registerPost = async (req,res)=>{
    if(req.user){
        req.flash('error','User Already Logged In.')
        return res.redirect('/campgrounds')
    }
const {email,username,password}= req.body;
try{
    const user = new User({email,username})
    const regUser = await User.register(user,password)
    req.login(regUser,err=>{    // built in method for directly redirecting user after a succes resgister
        if(err) return next(err)
        req.flash('success','Welcome To Yelp Camp')
        res.redirect('/campgrounds')    
    })
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}
module.exports.loginGet = (req,res)=>{
    if(req.user){
        req.flash('error','User Already Logged In.')
        return res.redirect('/campgrounds')
    }
    res.render('users/login')
}
module.exports.loginPost = (req,res)=>{
    if(req.user){
        return res.redirect('/campgrounds')
    }
    const {username} = req.body
    req.flash('success','Welcome  Back, ',username.toUpperCase())
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}
module.exports.Logout = (req,res)=>{
    
    req.logOut(e=>{
        if(e){console.log(e)}
    });
    req.flash('success','GoodBye!')
    res.redirect('/login')
}