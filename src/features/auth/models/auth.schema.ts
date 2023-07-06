import { IAuthDocument } from '@auth/interfaces/auth.interface';

import { model, Model, Schema } from 'mongoose';
import { hash, compare } from 'bcryptjs';
const SALT_ROUND = 10;
const authSchema: Schema = new Schema(
  {
    username: {
      type: String
    },
    uId: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    avatarColor: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);
authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  const hashPassword = await hash(this.password, SALT_ROUND);
  this.password = hashPassword;
  next();
});
authSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  const hashPassword: string = (this as unknown as IAuthDocument).password!;
  return compare(password, hashPassword);
};
authSchema.methods.hashPassword = function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};
const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
export default AuthModel;
