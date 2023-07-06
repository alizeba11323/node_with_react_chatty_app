import dotenv from 'dotenv';
import * as bunyan from 'bunyan';
import cloudinary from 'cloudinary';
dotenv.config({});

class Config {
  public DB_URI: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URI: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLIENT_NAME: string | undefined;
  public API_KEY: string | undefined;
  public API_SECRET: string | undefined;
  public CLOUDINARY_URL: string | undefined;
  constructor() {
    this.DB_URI = process.env.DB_URI;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234567890';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URI = process.env.CLIENT_URI || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.API_KEY = process.env.API_KEY || '';
    this.API_SECRET = process.env.API_SECRET || '';
    this.CLIENT_NAME = process.env.CLIENT_NAME || '';
    this.CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';
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
  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLIENT_NAME,
      api_key: this.API_KEY,
      api_secret: this.API_SECRET
    });
  }
}

export const config: Config = new Config();
