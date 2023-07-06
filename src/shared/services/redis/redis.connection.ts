import { config } from '@root/config';
import Logger from 'bunyan';
import { BaseCache } from '@service/redis/base.cache';

const log: Logger = config.createLogger('redisConnection');
class RedisConnection extends BaseCache {
  constructor() {
    super('RedisConnection');
  }
  async connect(): Promise<void> {
    try {
      await this.client.connect();
      const res = await this.client.ping();
      console.log(res);
    } catch (e) {
      log.error(e);
    }
  }
}

export const redisConnection = new RedisConnection();
