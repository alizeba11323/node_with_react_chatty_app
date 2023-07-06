import { Response, Request, NextFunction } from 'express';
import { config } from '@root/config';
import { verify } from 'jsonwebtoken';
import { NotAuthorizedError } from '@global/helpers/Error-Handler';
import { AuthPayload } from '@auth/interfaces/auth.interface';
class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session!.jwt) {
      throw new NotAuthorizedError('Token Not Available, Please Login Again');
    }
    try {
      const payload: AuthPayload = verify(req.session!.jwt, config.JWT_TOKEN!) as AuthPayload;
      req.currentUser = payload;
    } catch (err) {
      throw new NotAuthorizedError('Token Not Valid,Try Again');
    }
    next();
  }
  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) throw new NotAuthorizedError('Authentication required,Try Agaian');
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
