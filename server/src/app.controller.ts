import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { PrismaService } from './prisma.service';
import clerkClient, { RequireAuthProp } from '@clerk/clerk-sdk-node';
import {
  CreateOpportunityRequest,
  CreateProfileDataRequest,
  ProfileDataRequest,
  UserRole,
  SwapDatesWithStrings,
  UpdateOpportunityRequest,
  UpdateOpportunityImageRequest,
} from '../../sharedTypes';

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('role')
  async getRole(
    @Req() req: RequireAuthProp<Request>,
  ): Promise<{ role: UserRole | null }> {
    const user = await this.appService.getUser(req.auth.userId);
    if (!user) {
      // user has created account with Clerk, but it does not exist in database yet
      return { role: null };
    }
    return { role: user.role as UserRole };
  }

  @Get('profile')
  async getProfile(@Req() req: RequireAuthProp<Request>) {
    const [clerkUser, user] = await Promise.all([
      clerkClient.users.getUser(req.auth.userId),
      this.appService.getVolunteerUser(req.auth.userId),
    ]);

    if (!user) {
      // user has created account with Clerk, but it does not exist in database yet
      throw new NotFoundException('Profile has not been added yet');
    }

    return { ...user, email: clerkUser.emailAddresses[0].emailAddress };
  }

  @Post('profile')
  async addProfile(@Req() req: RequireAuthProp<Request>) {
    let user = await this.appService.getUser(req.auth.userId);
    if (user) {
      throw new BadRequestException('Profile already added');
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      residentialStatus,
      skills,
      experience,
      address,
      postalCode,
      preferences,
    } = req.body as SwapDatesWithStrings<CreateProfileDataRequest>;

    await this.prisma.user.create({
      data: {
        clerkUserId: req.auth.userId,
        role: 'VOLUNTEER',
        volunteer: {
          create: {
            firstName,
            lastName,
            address,
            dateOfBirth,
            experience,
            gender,
            phone,
            postalCode,
            residentialStatus,
            skills,
            VolunteerPreference: {
              create: preferences.map((pref) => ({
                preference: pref,
              })),
            },
          },
        },
      },
    });
  }

  @Put('profile')
  async updateProfile(@Req() req: RequireAuthProp<Request>) {
    const user = await this.appService.getUser(req.auth.userId);
    if (!user) {
      // user has created account with Clerk, but it does not exist in database yet
      throw new NotFoundException('Profile has not been added yet');
    }

    const { phone, skills, experience, address, postalCode, preferences } =
      req.body as SwapDatesWithStrings<ProfileDataRequest>;

    const deleteVolunteerPreferences =
      this.prisma.volunteerPreference.deleteMany({
        where: {
          volunteerId: {
            equals: req.auth.userId,
          },
        },
      });

    const updateUser = this.prisma.user.update({
      where: {
        clerkUserId: req.auth.userId,
      },
      data: {
        volunteer: {
          update: {
            data: {
              address,
              experience,
              phone,
              postalCode,
              skills,
            },
          },
        },
      },
    });
    const addVolunteerPreferences = this.prisma.volunteerPreference.createMany({
      data: preferences.map((pref) => ({
        volunteerId: req.auth.userId,
        preference: pref,
      })),
    });

    await this.prisma.$transaction([
      deleteVolunteerPreferences,
      updateUser,
      addVolunteerPreferences,
    ]);
  }

  @Get('opportunities')
  async getOpportunities(@Req() req: RequireAuthProp<Request>) {
    console.log(req.query);
    return {
      opportunities: await this.prisma.opportunity.findMany({
        orderBy: { start: 'asc' },
      }),
    };
  }

  @Get('admin/opportunities')
  async adminGetOpportunities(@Req() req: RequireAuthProp<Request>) {
    console.log(req.query);
    return {
      opportunities: await this.prisma.opportunity.findMany({
        orderBy: { start: 'asc' },
      }),
    };
  }

  @Post('admin/opportunities')
  async adminCreateOpportunity(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    const { name, description, start, end, durationMinutes, imageUrl } =
      req.body as SwapDatesWithStrings<CreateOpportunityRequest>;

    if (new Date(start) > new Date(end))
      throw new BadRequestException('start cannot be after end');

    const opportunity = await this.prisma.opportunity.create({
      data: {
        name,
        description,
        start,
        end,
        durationMinutes,
        imageUrl,
      },
    });

    return {
      opportunity,
    };
  }

  @Put('admin/opportunities/:id')
  async adminUpdateOpportunity(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    let opportunity = await this.prisma.opportunity.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!opportunity)
      throw new NotFoundException('No opportunity found with that id');

    const { name, description, start, end, durationMinutes } =
      req.body as SwapDatesWithStrings<UpdateOpportunityRequest>;
    if (new Date(start) > new Date(end))
      throw new BadRequestException('start cannot be after end');

    opportunity = await this.prisma.opportunity.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        description,
        start,
        end,
        durationMinutes,
      },
    });

    return {
      opportunity,
    };
  }

  @Put('admin/opportunities/:id/image')
  async adminUpdateOpportunityImage(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    let opportunity = await this.prisma.opportunity.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!opportunity)
      throw new NotFoundException('No opportunity found with that id');

    const { imageUrl } = req.body as UpdateOpportunityImageRequest;

    opportunity = await this.prisma.opportunity.update({
      where: {
        id: req.params.id,
      },
      data: {
        imageUrl,
      },
    });

    return {
      opportunity,
    };
  }

  @Delete('admin/opportunities/:id')
  async adminDeleteOpportunity(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    await this.prisma.opportunity.delete({
      where: {
        id: req.params.id,
      },
    });
  }
}
