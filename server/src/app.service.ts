import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(clerkUserId: string) {
    return await this.prisma.user.findUnique({
      where: {
        clerkUserId,
      },
    });
  }

  async getVolunteerUser(clerkUserId: string) {
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

  async checkUserIsAdmin(clerkUserId: string) {
    const user = await this.getUser(clerkUserId);
    if (!user || user.role !== 'ADMIN') throw new ForbiddenException();
  }

  async checkUserIsVolunteer(clerkUserId: string) {
    const user = await this.getUser(clerkUserId);
    if (!user || user.role !== 'VOLUNTEER') throw new ForbiddenException();
  }
}
