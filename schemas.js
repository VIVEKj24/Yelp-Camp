const Joi = require('joi')

module.exports.campgroundschema=Joi.object({
    title:Joi.string().required(),
    price:Joi.number().required().min(0),
    description:Joi.string().required(),
    location:Joi.string().required(),
    deleteImages:Joi.array()
})