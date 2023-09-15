const Joi = require('joi')
const { ObjectSchema } = require('joi')

const registerSchema = Joi.object({
  first_name: Joi.string().min(3).max(24).required(),
  last_name: Joi.string().min(3).max(24).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

module.exports = {
  registerSchema,
  loginSchema
} 


// const registerSchema = Joi.object().keys({
//   first_name: Joi.string().min(3).max(24).required(),
//   last_name: Joi.string().min(3).max(24).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// })

// const loginSchema = Joi.object().keys({
//   email: Joi.string().email().required(),
//   password: Joi.string().required()
// })

// export default {
//   '/api/v1/auth/': registerSchema,
//   '/api/v1/auth/': loginSchema,
// }