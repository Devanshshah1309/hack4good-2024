import {
  Controller,
  Get,
  NotFoundException,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { PrismaService } from './prisma.service';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello() {
    return 'Hello world';
  }

  @Get('me')
  async getMe(@Req() req: RequireAuthProp<Request>) {
    const user = await this.appService.getUser(req.auth.userId);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Put('me')
  async updateMe(@Req() req: RequireAuthProp<Request>) {
    const { firstName, lastName } = req.body;
    let user = await this.appService.getUser(req.auth.userId);
    if (!user) {
      // user has created account with Clerk, but it does not exist in database yet
      user = await this.prisma.user.create({
        data: {
          clerkUserId: req.auth.userId,
          firstName,
          lastName,
        },
      });
    } else {
      // User already exists in db
      user = await this.prisma.user.update({
        where: {
          clerkUserId: req.auth.userId,
        },
        data: {
          firstName,
          lastName,
        },
      });
    }

    return user;
  }
}
