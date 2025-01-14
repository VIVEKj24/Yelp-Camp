const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user')
const mongoosefuzzysearch = require('mongoose-fuzzy-searching')


const ImageSchema = new Schema({
      url:String,
      filename:String
})
ImageSchema.virtual('thumbnail').get(function() {
  const transformed = this.url.replace('/upload', '/upload/w_200,h_140');
  return transformed;
});
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    geometry: {
      type: {
          type: String,
          enum: ['Point'],
          required: true
      },
      coordinates: {
          type: [Number],
          required: true
      }
  },
    price:Number,
    description:String,
    location:String,
    author:[{
      type:Schema.Types.ObjectId,
      ref:'User'
    }],
    reviews:[{
        // a one to many relationship, a single camp have many reviews, will store each review's object id
        type:Schema.Types.ObjectId,
        ref:'Review'//  refernece to review model
    }]
},opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});

 CampgroundSchema.plugin(mongoosefuzzysearch,{fields:['title']})
 // Suppose we are del. a camp, but review db conatains the review associated with that camp. so we have to del. them 
 CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    try {
      // Delete all reviews where the _id is in the campground's reviews array
      await Review.deleteMany({ _id: { $in: doc.reviews } });
      console.log('Associated reviews deleted successfully.');
    } catch (err) {
      console.error('Error deleting associated reviews:', err);
    }
  }
});

module.exports= mongoose.model('Campground',CampgroundSchema)