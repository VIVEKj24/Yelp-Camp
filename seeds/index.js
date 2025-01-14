const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.error('MongoDB connection error:', err));

const seedDb= async()=>{
    await Campground.deleteMany({})
    for (let i=0;i<=50;i++){
        const ran1000 = Math.floor(Math.random()*1000)
        const ranPlaces = Math.floor(Math.random()*places.length)
        const ranDes = Math.floor(Math.random()*descriptors.length)

        const c = new Campground({
            title:`${descriptors[ranDes]} ${places[ranPlaces]}`,
            location:`${cities[ran1000].city},${cities[ran1000].state}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price:`${ran1000}`,
            author:'677e4aef95300f50b84a9d98',
            geometry: {
              type: "Point",
              coordinates: [
                  cities[ran1000].longitude,
                  cities[ran1000].latitude,
              ]
          },
            images:[
                {
                  url: 'https://res.cloudinary.com/dah92wcen/image/upload/v1736677227/Yelpcamp/zthipbjglgttdv3dnl7e.jpg',
                  filename: 'Yelpcamp/ncdu4byngfgnxaft9urg'
                },
                {
                  url: 'https://res.cloudinary.com/dah92wcen/image/upload/v1736677227/Yelpcamp/alul8dm96dby4mdt6wrn.jpg',
                  filename: 'Yelpcamp/qhj9eek8clqnqpopcprd'
                }
              ]}
        )
    await c.save()
    }
    
}
seedDb()