import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import mongoose from 'mongoose';

class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }
  public async getUserByUserAuthId(userId: string): Promise<IUserDocument> {
    // console.log(userId);
    return (await UserModel.findOne({ authId: new mongoose.Types.ObjectId(userId) })) as IUserDocument;
  }
  public async getUserById(userId: string): Promise<IUserDocument> {
    const user: IUserDocument[] = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' }
      },
      {
        $unwind: '$authId'
      },
      {
        $project: this.AggregateProjection()
      }
    ]);
    return user[0];
  }
  private AggregateProjection() {
    return {
      _id: 1,
      username: '$authId.username',
      email: '$authId.email',
      uId: '$authId.uId',
      avatarColor: '$authId.avatarColor',
      createdAt: '$authId.createdAt',
      postsCount: 1,
      work: 1,
      location: 1,
      quote: 1,
      school: 1,
      blockedBy: 1,
      blocked: 1,
      notifications: 1,
      social: 1,
      bgImageVersion: 1,
      bgImageId: 1,
      profilePicture: 1
    };
  }
}
export const userServise: UserService = new UserService();
