import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';
const log: Logger = config.createLogger('setupDatabase');
export default () => {
  const connect = () => {
    mongoose
      .connect(config.DB_URI!)
      .then(() => {
        log.info('DB Connected Successfully');
      })
      .catch((err) => {
        log.error('Error Occure in DB ' + err);
        return process.exit(1);
      });
  };
  connect();
};
