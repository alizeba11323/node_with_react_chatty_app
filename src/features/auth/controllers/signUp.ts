import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { JoiValidation } from '@global/decorators/joi-validation.decorator';
import { signUpSchema } from '@auth/schemes/signUp';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/Error-Handler';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import HTTP_STATUS from 'http-status-codes';
import { Helper } from '@global/helpers/helpers';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserCache } from '@service/redis/user.cache';
import { omit } from 'lodash';
import JWT from 'jsonwebtoken';
import { authQueue } from '@service/queues/auth.queue';
import { userQueue } from '@service/queues/user.queue';
import { config } from '@root/config';
const userCache: UserCache = new UserCache();
export class SignUp {
  @JoiValidation(signUpSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkUserExists: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
    if (checkUserExists) throw new BadRequestError('Invalid Credentials');
    const authObject: ObjectId = new ObjectId();
    const userObject: ObjectId = new ObjectId();
    const uId = `${Helper.generateRandomNumber(12)}`;
    const authData: IAuthDocument = SignUp.prototype.SignupData({
      _id: authObject,
      uId,
      username,
      email,
      password,
      avatarColor
    });
    const result: UploadApiResponse = (await uploads(avatarImage, `${userObject}`, true, true)) as UploadApiResponse;
    if (!result?.public_id) throw new BadRequestError('File Upload: Error Occured, Try Again');
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObject);
    console.log(userDataForCache);
    userDataForCache.profilePicture = `https://res.cloudinary.com/dldpjxvyb/image/upload/v${result.version}/${userObject}`;
    await userCache.saveUserToCache(`${userObject}`, uId, userDataForCache);
    omit(userDataForCache, ['username', 'uId', 'email', 'password', 'avatarColor']);
    authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
    userQueue.addUserJob('addUserToDB', { value: userDataForCache });
    const userJWT: string = SignUp.prototype.signUpToken(authData, userObject);
    req.session = { jwt: userJWT };
    res.status(HTTP_STATUS.CREATED).json({ message: 'User Created Successfully', authData, token: userJWT });
  }
  private signUpToken(userData: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: userData.uId,
        username: userData.username,
        email: userData.email,
        avatarColor: userData.avatarColor
      },
      config.JWT_TOKEN!
    );
  }

  private SignupData(data: ISignUpData): IAuthDocument {
    const { _id, uId, email, password, avatarColor, username } = data;
    return {
      _id,
      uId,
      username: Helper.firstLetterUppercase(username),
      email: Helper.lowercase(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, uId, password, username, email, avatarColor } = data;
    return {
      authId: _id,
      _id: userObjectId,
      uId,
      username: Helper.firstLetterUppercase(username),
      email: Helper.lowercase(email),
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      school: '',
      quote: '',
      location: '',
      bgImageId: '',
      bgImageVersion: '',
      followerCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}
