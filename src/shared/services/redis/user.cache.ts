import { BaseCache } from '@service/redis/base.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/Error-Handler';
import { Helper } from '@global/helpers/helpers';
const log: Logger = config.createLogger('RedisConnection');
export class UserCache extends BaseCache {
  constructor() {
    super('UserCache');
  }
  public async saveUserToCache(key: string, userId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      followerCount,
      followingCount,
      blocked,
      blockedBy,
      bgImageId,
      bgImageVersion,
      social,
      postsCount,
      profilePicture,
      notifications,
      quote,
      work,
      location,
      avatarColor,
      school
    } = createdUser;

    const dataToSave: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'postsCount',
      `${postsCount}`,
      'profilePicture',
      `${profilePicture}`,
      'followerCount',
      `${followerCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageId',
      `${bgImageId}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'social',
      JSON.stringify(social),
      'createdAt',
      `${createdAt}`
    ];

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.ZADD('user', { score: parseInt(userId, 10), value: `${key}` });
      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (err) {
      log.error(err);
      throw new ServerError('Server Error,Try Again');
    }
  }

  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: IUserDocument = (await this.client.HGETALL(`users:${userId}`)) as unknown as IUserDocument;

      response.blocked = Helper.ParsedData(`${response.blocked}`);
      response.blockedBy = Helper.ParsedData(`${response.blockedBy}`);
      response.createdAt = new Date(Helper.ParsedData(`${response.createdAt}`));
      response.followerCount = Helper.ParsedData(`${response.followerCount}`) as number;
      response.followingCount = Helper.ParsedData(`${response.followingCount}`) as number;
      response.social = Helper.ParsedData(`${response.social}`);
      response.notifications = Helper.ParsedData(`${response.notifications}`);
      response.postsCount = Helper.ParsedData(`${response.postsCount}`) as number;
      return response;
    } catch (err) {
      log.error(err);
      throw new ServerError('Server Error, Try Again');
    }
  }
}
