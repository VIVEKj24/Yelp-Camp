const Joi =require('joi')
const ExpressError = require('./ExpressErrors')
const {campgroundschema}= require('../schemas')

const validateCampground= (req,res,next)=>{
    const {error} =campgroundschema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}
const validatebyname =(req,res,next)=>{
    const nameschema=Joi.object({
        title:Joi.string().required()
    }) 
    const {error} =nameschema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}
module.exports = { validateCampground, validatebyname };
