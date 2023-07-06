import Joi, { ObjectSchema } from 'joi';

export const EmailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be type string',
    'string.email': 'Invalid Email',
    'string.required': 'Email is Required'
  })
});

export const PasswordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().min(4).max(8).required().messages({
    'string.base': 'Password must be type string',
    'string.min': 'Invalid Password',
    'string.max': 'Invalid Password',
    'string.empty': 'Password is Required'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Password Should be Match',
    'any.required': 'Password is Required'
  })
});
