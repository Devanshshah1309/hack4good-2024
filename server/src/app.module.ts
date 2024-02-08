import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  UnauthorizedException,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ClerkExpressWithAuth,
  LooseAuthProp,
  WithAuthProp,
} from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import { PrismaService } from './prisma.service';

declare global {
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, Logger],
})
export class AppModule implements NestModule {
  /** This middleware throws UnauthorizedException. It should run after ClerkExpressWithAuth middleware. */
  private authMiddleware(
    req: WithAuthProp<Request>,
    res: Response,
    next: NextFunction,
  ) {
    // req.auth.sessionId will be set to null by ClerkExpressWithAuth if request is unauthenticated.
    if (!req.auth?.sessionId) {
      throw new UnauthorizedException();
    }
    next();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ClerkExpressWithAuth({ onError: (err) => console.log(err) }), // Clerk middleware to set the "auth" key in Request object
        this.authMiddleware,
      )
      .exclude('api/v1/certificate/(.*)')
      .forRoutes('*');
  }
}
