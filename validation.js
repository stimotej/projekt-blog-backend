const Joi = require("joi");

// Validate register request
const registerValidation = (data) => {
  // Create validation schema
  const schema = Joi.object({
    name: Joi.string(),
    username: Joi.string().min(4).required(),
    password: Joi.string().min(5).required(),
    email: Joi.string().email(),
    role: Joi.string().required(),
  });

  // Validate data based on schema
  return schema.validate(data);
};

// Validate update admin request
const updateAdminValidation = (data) => {
  // Create validation schema
  const schema = Joi.object({
    name: Joi.string(),
    username: Joi.string().min(4).required(),
    email: Joi.string().email(),
  });

  // Validate data based on schema
  return schema.validate(data);
};

// Validate login request
const loginValidation = (data) => {
  // Create validation schema
  const schema = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string().min(5).required(),
  });

  // Validate data based on schema
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.updateAdminValidation = updateAdminValidation;
module.exports.loginValidation = loginValidation;
