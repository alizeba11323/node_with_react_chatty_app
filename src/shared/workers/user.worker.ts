import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import Logger from 'bunyan';
import { userServise } from '@service/db/user.service';
const log: Logger = config.createLogger('userWorker');
class UserWorker {
  public async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await userServise.addUserData(value);
      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
