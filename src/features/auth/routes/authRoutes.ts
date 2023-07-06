import { CurrentUser } from '@auth/controllers/currentUser';
import { SignIn } from '@auth/controllers/signIn';
import { SignOut } from '@auth/controllers/signOut';
import { SignUp } from '@auth/controllers/signUp';
import express, { Router } from 'express';
class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post('/signUp', SignUp.prototype.create);
    this.router.post('/signIn', SignIn.prototype.read);
    return this.router;
  }
  public logoutRoute(): Router {
    this.router.get('/logout', SignOut.prototype.Logout);
    return this.router;
  }
}

export const authRoutes = new AuthRoutes();
