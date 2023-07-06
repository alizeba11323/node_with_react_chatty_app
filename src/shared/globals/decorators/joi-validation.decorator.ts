/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JoiValidationError } from '@global/helpers/Error-Handler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;
export function JoiValidation(schema: ObjectSchema): IJoiDecorator {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const methodOriginal = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) throw new JoiValidationError(error?.details[0].message);
      methodOriginal.apply(this, args);
      return descriptor;
    };
  };
}
