import {
  Injectable,
  Logger,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  UnauthorizedException,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import clerkClient, {
  ClerkExpressWithAuth,
  LooseAuthProp,
  RequireAuthProp,
  WithAuthProp,
} from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { HealthController } from './health.controller';

declare global {
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

@Module({
  imports: [],
  controllers: [HealthController, AppController],
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
        CreateNewUserMiddleware,
      )
      .exclude('health', 'api/v1/certificate/(.*)')
      .forRoutes('*');
  }
}

@Injectable()
export class CreateNewUserMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: RequireAuthProp<Request>, res: Response, next: NextFunction) {
    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          clerkUserId: req.auth.userId,
        },
      });

      if (!user)
        await tx.user.create({
          data: {
            clerkUserId: req.auth.userId,
            email: (await clerkClient.users.getUser(req.auth.userId))
              .emailAddresses[0].emailAddress,
            role: 'VOLUNTEER',
          },
        });
    });

    next();
  }
}
