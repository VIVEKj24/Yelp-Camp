if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
require('dotenv').config();

const express = require('express');
const app =express();
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride=require('method-override')
const ExpressError = require('./utils/ExpressErrors')
const campgroundRoute = require('./routes/campground.js')
const userRoute = require('./routes/users.js')
const session =require('express-session')
const flash =  require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');
const dbUrl = process.env.DB_URL
const MongoStore = require('connect-mongo');

// 'mongodb://127.0.0.1:27017/yelpcamp'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static('public'));
app.use(mongoSanitize())// use to avoid extra opretors such as & $ in the query strings

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
const sessionConfig ={// some session conif. so it do not give depricition
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,//so that no third party can access
        expires:Date.now()+(1000*60*60*24*7),// when the cookie should expire
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) // how to store user data in session
passport.deserializeUser(User.deserializeUser())// how to unstore user dta in session
app.use(flash())
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",

    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",

    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dah92wcen/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://api.maptiler.com",
                "https://queticosuperior.org/wp-content/uploads/2023/05/IMG_1863-1024x768.jpg",
                "https://queticosuperior.org/wp-content/uploads/2023/05/IMG_1863-1024x768.jpg"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req,res,next)=>{
    res.locals.currentUrl = req.url;
    res.locals.currentUser= req.user;
    res.locals.success=req.flash('success')// this method allows all the templates have access to sucess
    res.locals.error=req.flash('error')// this method allows all the templates have access to error

    next()
})



app.get('/',(req,res)=>{
    res.render('home')
})
app.use('/',userRoute)
app.use('/campgrounds',campgroundRoute)


app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500,message="went wrong"}=err;
    res.status()
    res.status(statusCode).render('error',{err})
})
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})