const Joi = require("joi");

const joiAddContactSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  favorite: Joi.bool().required(),
});

const joiPatchContactSchema = Joi.object({ 
  name: Joi.string().min(5),
  email: Joi.string().email(),
  phone: Joi.string().min(10),
});

module.exports = { joiAddContactSchema, joiPatchContactSchema };