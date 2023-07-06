import Joi, { ObjectSchema } from 'joi';

export const signUpSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Username must be type string',
    'string.min': 'Invalid Username',
    'string.max': 'Invalid Username',
    'string.empty': 'Username is Required'
  }),
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be type string',
    'string.min': 'Invalid Password',
    'string.max': 'Invalid Password',
    'string.empty': 'Password is Required'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be type string',
    'string.email': 'Invalid Email',
    'string.empty': 'Username is Required'
  }),
  avatarColor: Joi.string().required().messages({
    'any.required': 'Avatar Color is Required'
  }),
  avatarImage: Joi.string().required().messages({
    'any.required': 'Avatar Image is Required'
  })
});
