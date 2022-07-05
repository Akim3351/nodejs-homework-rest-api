const Joi = require("joi");

const authSchema = Joi.object({
  
  name: Joi.string().trim(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
  subscription: Joi.string().default("starter").valid("starter", "pro", "business").trim(),
  token: [Joi.string(), Joi.number()],
});

module.exports = {
    authSchema,
}