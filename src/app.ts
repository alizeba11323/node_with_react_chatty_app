import express, { Express } from 'express';
import SetUpDB from '@root/setupDatabase';
import { config } from '@root/config';
import { ChattyServer } from '@root/setupServer';
class Application {
  public initialize(): void {
    SetUpDB();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    server.start();
    this.loadConfig();
  }
  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const app: Application = new Application();
app.initialize();
