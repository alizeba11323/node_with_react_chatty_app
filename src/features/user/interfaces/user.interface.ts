import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IUserDocument extends Document {
  _id: string | ObjectId;
  authId: string | ObjectId;
  username: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  followerCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageId: string;
  bgImageVersion: string;
  profilePicture: string;
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
  createdAt?: Date;
}
export interface User {
  _id: string | ObjectId;
  authId: string | ObjectId;
  username: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  followerCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageId: string;
  bgImageVersion: string;
  profilePicture: string;
  passwordResetToken?: string;
  passwordResetExpires?: number | string;
}

export interface IResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}

export interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}
export interface IBasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}

export interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface ILogin {
  userId: string;
}
export interface ISocketData {
  blockedBy: string;
  blockedUser: string;
}
export interface IUserInfo {
  key?: string;
  value?: string | ISocialLinks;
}
export interface IUserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | INotificationSettings | IUserDocument;
}
export interface IEmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}
export interface IAllUsers {
  users: IUserDocument[];
  totalUsers: number;
}
