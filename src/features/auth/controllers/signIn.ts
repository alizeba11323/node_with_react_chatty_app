import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { JoiValidation } from '@global/decorators/joi-validation.decorator';
import { SignInSchema } from '@auth/schemes/signIn';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/Error-Handler';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userServise } from '@service/db/user.service';
export class SignIn {
  @JoiValidation(SignInSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const checkUser: IAuthDocument = await authService.getUserByUsername(username);
    if (!checkUser) throw new BadRequestError('Invalid Credentials');
    const passwordMatch: boolean = await checkUser.comparePassword(password);
    if (!passwordMatch) throw new BadRequestError('Invalid Credentials');
    const user: IUserDocument = await userServise.getUserByUserAuthId(`${checkUser._id}`);
    const userJWT: string = JWT.sign(
      {
        userId: user._id,
        uId: checkUser.uId,
        username: checkUser.username,
        email: checkUser.email,
        avatarColor: checkUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJWT };
    const userDocument: IUserDocument = {
      ...user.toObject(),
      username: checkUser.username,
      email: checkUser.email,
      avatarColor: checkUser.avatarColor,
      uId: checkUser.uId,
      createdAt: checkUser.createdAt
    } as unknown as IUserDocument;
    res.status(HTTP_STATUS.OK).json({ message: 'User loggedIn Successfully', user: userDocument, token: userJWT });
  }
}
