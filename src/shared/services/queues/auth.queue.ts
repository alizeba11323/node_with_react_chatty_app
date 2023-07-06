import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { authWork } from '@worker/auth.worker';

class AuthQueue extends BaseQueue {
  constructor() {
    super('Auth');
    this.processJob('addAuthUserToDB', 5, authWork.addUserToDB);
  }
  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue = new AuthQueue();
