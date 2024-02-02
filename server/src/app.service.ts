import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(clerkUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        clerkUserId,
      },
      include: {
        volunteer: {
          include: {
            VolunteerPreference: true,
          },
        },
      },
    });

    return user;
  }
}
