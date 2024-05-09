const joi = require('joi');

module.exports.listingSchemaMethod = joi.object({
    listingObject : joi.object({

        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),    // price minimum value should be zero
        image: joi.string().allow("", null),    // image can be either empty string or it could have null values
        
    }).required(),
});



module.exports.reviewSchemaMethod = joi.object({
    reviewObject : joi.object({

        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5),   
        
    }).required(),
});