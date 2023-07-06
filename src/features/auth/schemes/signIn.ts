import Joi, { ObjectSchema } from 'joi';

export const SignInSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Username must be type String',
    'string.min': 'Invalid Username Min',
    'string.max': 'Invalid Username Max',
    'string.empty': 'Username is Required'
  }),
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password must be type String',
    'string.min': 'Invalid Password',
    'string.max': 'Invalid Password',
    'string.empty': 'Password is Required'
  })
});
