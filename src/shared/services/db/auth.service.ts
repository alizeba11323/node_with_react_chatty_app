import { IAuthDocument } from '@auth/interfaces/auth.interface';
import AuthModel from '@auth/models/auth.schema';
import { Helper } from '@global/helpers/helpers';
import { IUserDocument } from '@user/interfaces/user.interface';

class AuthService {
  public async addUser(user: IAuthDocument | IUserDocument): Promise<void> {
    await AuthModel.create(user);
  }
  public async getUserByUsername(username: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ username: `${Helper.firstLetterUppercase(username)}` })) as IAuthDocument;
    return user;
  }

  public async getUserByUsernameOrEmail(username?: string, email?: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helper.firstLetterUppercase(username!) }, { email: Helper.lowercase(email!) }]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }
}

export const authService: AuthService = new AuthService();
