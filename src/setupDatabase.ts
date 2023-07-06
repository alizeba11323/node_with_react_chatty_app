import mongoose from 'mongoose';
import { config } from '@root/config';
import Logger from 'bunyan';
import { redisConnection } from '@service/redis/redis.connection';
const log: Logger = config.createLogger('setupDatabase');
export default () => {
  const connect = () => {
    mongoose
      .connect(config.DB_URI!)
      .then(() => {
        log.info('DB Connected Successfully');
        redisConnection.connect();
      })
      .catch((err) => {
        log.error('Error Occure in DB ' + err);
        return process.exit(1);
      });
  };
  connect();
};
