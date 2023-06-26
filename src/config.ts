import dotenv from 'dotenv';
import * as bunyan from 'bunyan';
dotenv.config({});

class Config {
  public DB_URI: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URI: string | undefined;
  public REDIS_HOST: string | undefined;
  constructor() {
    this.DB_URI = process.env.DB_URI;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234567890';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URI = process.env.CLIENT_URI || '';
    this.REDIS_HOST = process.env.REDIS_HOST || ' ';
  }
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }
  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error('Configuration ' + key + 'is undefined');
      }
    }
  }
}

export const config: Config = new Config();
