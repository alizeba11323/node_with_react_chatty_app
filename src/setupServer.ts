import { json, urlencoded, Response, Request, NextFunction, Application } from 'express';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@root/config';
import compression from 'compression';
import 'express-async-errors';
import applicationRoutes from '@root/routes';
import { CustomError, IErrorResponse } from '@global/helpers/Error-Handler';
const HTTP_PORT = 5000;
const log = config.createLogger('server');
export class ChattyServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 60 * 60 * 1000,
        secure: config.NODE_ENV !== 'development'
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }
  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }
  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} is not found` });
    });
    app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) res.status(error.statusCode).json(error.serializeErrors());
      next();
    });
  }
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnection(socketIO);
    } catch (err) {
      log.error(err);
    }
  }
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URI,
        methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }
  private startHttpServer(httpServer: http.Server): void {
    log.info('server started with process' + process.pid);
    httpServer.listen(HTTP_PORT, () => {
      log.info('App running on port ' + HTTP_PORT);
    });
  }
  private socketIOConnection(io: Server): void {}
}
