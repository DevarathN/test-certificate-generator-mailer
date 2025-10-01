const Joi = require('joi');

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;

exports.schema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  gstNumber: Joi.string().length(15).pattern(gstRegex).required(),
  businessName: Joi.string().min(1).max(150).required(),
  businessAddress: Joi.string().min(1).max(500).required()
});
