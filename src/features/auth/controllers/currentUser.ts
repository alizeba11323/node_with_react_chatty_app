import { Request, Response } from 'express';
import { UserCache } from '@service/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userServise } from '@service/db/user.service';
import HTTP_STATUS from 'http-status-codes';
const userCache: UserCache = new UserCache();
export class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = null;
    let token = '';
    let user = null;
    const getUser: IUserDocument = (await userCache.getUserFromCache(req.currentUser!.userId)) as IUserDocument;
    const existsUser: IUserDocument = getUser ? getUser : await userServise.getUserById(req.currentUser!.userId);
    if (Object.keys(existsUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = existsUser;
    }
    res.status(HTTP_STATUS.OK).json({ message: 'User Fetched Successfully', token, isUser, user });
  }
}
