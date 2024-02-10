import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { PrismaService } from './prisma.service';
import clerkClient, { RequireAuthProp } from '@clerk/clerk-sdk-node';
import {
  CreateOpportunityRequest,
  CreateProfileDataRequest,
  UpdateProfileDataRequest,
  UserRole,
  SwapDatesWithStrings,
  UpdateOpportunityRequest,
  UpdateOpportunityImageRequest,
} from './types';
import dayjs from 'dayjs';
import { createReadStream } from 'fs';

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
    const user = await this.appService.getUserJoinVolunteer(req.auth.userId);
    if (!user) {
      return { role: null };
    }
    if (user.role === 'ADMIN') {
      return { role: 'ADMIN' };
    }
    if (!user.volunteer) {
      return { role: null };
    }
    return { role: user.role as UserRole };
  }

  @Get('profile')
  async getProfile(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsVolunteer(req.auth.userId);

    const user = await this.appService.getUserJoinVolunteer(req.auth.userId);

    if (!user || !user.volunteer) {
      throw new NotFoundException('Profile has not been added yet');
    }

    return { ...user };
  }

  @Post('profile')
  async addProfile(@Req() req: RequireAuthProp<Request>) {
    const [clerkUser, user] = await Promise.all([
      clerkClient.users.getUser(req.auth.userId),
      this.appService.getUserJoinVolunteer(req.auth.userId),
    ]);
    if (user?.volunteer) {
      throw new BadRequestException('Profile already added');
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      occupation,
      school,
      educationBackground,
      driving,
      ownsVehicle,
      commitmentLevel,
      phone,
      residentialStatus,
      skills,
      experience,
      address,
      postalCode,
      preferences,
    } = req.body as SwapDatesWithStrings<CreateProfileDataRequest>;

    await this.prisma.volunteer.create({
      data: {
        userId: req.auth.userId,
        firstName,
        lastName,
        address,
        dateOfBirth,
        experience,
        gender,
        occupation,
        school,
        educationBackground,
        driving,
        ownsVehicle,
        commitmentLevel,
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
    });
  }

  @Put('profile')
  async updateProfile(@Req() req: RequireAuthProp<Request>) {
    const user = await this.appService.getUserJoinVolunteer(req.auth.userId);
    if (!user?.volunteer) {
      throw new NotFoundException('Profile has not been added yet');
    }

    const {
      occupation,
      school,
      educationBackground,
      driving,
      ownsVehicle,
      commitmentLevel,
      phone,
      skills,
      experience,
      address,
      postalCode,
      preferences,
    } = req.body as SwapDatesWithStrings<UpdateProfileDataRequest>;

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
              occupation,
              school,
              educationBackground,
              driving,
              ownsVehicle,
              commitmentLevel,
              phone,
              experience,
              skills,
              address,
              postalCode,
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

  // Returns different shape depending on whether request is made from volunteer or admin user
  @Get('opportunities')
  async getOpportunities(@Req() req: RequireAuthProp<Request>) {
    const role = (
      await this.prisma.user.findUnique({
        where: { clerkUserId: req.auth.userId },
      })
    )?.role as UserRole;

    return {
      opportunities: await this.prisma.opportunity.findMany({
        orderBy: { start: 'asc' },
        include:
          role === 'ADMIN'
            ? {
                _count: {
                  select: {
                    VolunteerOpportunityEnrollment: {
                      where: {
                        adminApproved: false,
                      },
                    },
                  },
                },
              }
            : role === 'VOLUNTEER'
              ? {
                  VolunteerOpportunityEnrollment: {
                    where: {
                      volunteerId: req.auth.userId,
                    },
                  },
                }
              : undefined,
      }),
    };
  }

  @Get('opportunities/:id')
  async getOpportunity(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsVolunteer(req.auth.userId);

    const opportunity = await this.prisma.opportunity.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!opportunity)
      throw new NotFoundException('No opportunity found with that id');

    const enrollment =
      await this.prisma.volunteerOpportunityEnrollment.findUnique({
        where: {
          volunteerId_opportunityId: {
            volunteerId: req.auth.userId,
            opportunityId: req.params.id,
          },
        },
      });

    return {
      opportunity,
      enrollment,
    };
  }

  @Get('certificate/volunteer/:volunteerId/opportunities/:opportunityId/')
  async getCertificate(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const enrollment =
      await this.prisma.volunteerOpportunityEnrollment.findUnique({
        where: {
          volunteerId_opportunityId: {
            opportunityId: req.params.opportunityId,
            volunteerId: req.params.volunteerId,
          },
        },
        include: {
          opportunity: true,
          volunteer: true,
        },
      });

    if (!enrollment)
      throw new NotFoundException('no enrollment for this opportunity');

    if (!enrollment.adminApproved || !enrollment.didAttend)
      throw new BadRequestException('You did not attend this opportunity');

    const oppStartDate = dayjs(enrollment.opportunity.start).format(
      'DD/MM/YYYY',
    );
    const oppEndDate = dayjs(enrollment.opportunity.end).format('DD/MM/YYYY');

    const filePath = await this.appService.generateCertificate({
      volunteer: `${enrollment.volunteer.firstName} ${enrollment.volunteer.lastName}`,
      hours: (enrollment.opportunity.durationMinutes / 60).toFixed(0),
      event: enrollment.opportunity.name,
      date:
        oppStartDate === oppEndDate
          ? `on ${oppStartDate}`
          : `from ${oppStartDate} to ${oppEndDate}`,
      generatedTime: new Date().toLocaleString(),
    });

    const stream = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="certificate.pdf"',
    });
    return new StreamableFile(stream);
  }

  /** For volunteers to register for an opportunity */
  @Post('opportunities/:id/enrol')
  async enrolOpportunity(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsVolunteer(req.auth.userId);

    const existing =
      await this.prisma.volunteerOpportunityEnrollment.findUnique({
        where: {
          volunteerId_opportunityId: {
            volunteerId: req.auth.userId,
            opportunityId: req.params.id,
          },
        },
      });

    if (existing)
      throw new BadRequestException(
        'You have already requested to enrol in this opportunity',
      );

    await this.prisma.volunteerOpportunityEnrollment.create({
      data: {
        volunteerId: req.auth.userId,
        opportunityId: req.params.id,
        adminApproved: false,
        didAttend: false,
      },
    });
  }

  @Get('admin/opportunities/:id')
  async adminGetOpportunity(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    const opportunity = await this.prisma.opportunity.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!opportunity)
      throw new NotFoundException('No opportunity found with that id');

    const enrollments =
      await this.prisma.volunteerOpportunityEnrollment.findMany({
        where: {
          opportunityId: req.params.id,
        },
        include: {
          volunteer: {
            select: {
              user: {
                select: {
                  email: true,
                },
              },
              firstName: true,
              lastName: true,
              gender: true,
              phone: true,
            },
          },
        },
      });

    return {
      opportunity,
      enrollments,
    };
  }

  @Post('admin/opportunities')
  async adminCreateOpportunity(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    const {
      name,
      description,
      start,
      end,
      location,
      durationMinutes,
      imageUrl,
      archive,
    } = req.body as SwapDatesWithStrings<CreateOpportunityRequest>;

    if (new Date(start) > new Date(end))
      throw new BadRequestException('start cannot be after end');

    const opportunity = await this.prisma.opportunity.create({
      data: {
        name,
        description,
        start,
        end,
        location,
        durationMinutes,
        imageUrl,
        archive,
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

    const {
      name,
      description,
      start,
      end,
      durationMinutes,
      location,
      archive,
    } = req.body as SwapDatesWithStrings<UpdateOpportunityRequest>;
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
        location,
        durationMinutes,
        archive,
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

  @Put('admin/opportunities/:opportunityId/enrollments/:volunteerId/approval')
  async adminUpdateEnrollmentApproval(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    const enrollment =
      await this.prisma.volunteerOpportunityEnrollment.findUnique({
        where: {
          volunteerId_opportunityId: {
            opportunityId: req.params.opportunityId,
            volunteerId: req.params.volunteerId,
          },
        },
      });

    if (!enrollment)
      throw new NotFoundException(
        'No enrollment found from that user for that opportunity',
      );

    const adminApproved = req.body.adminApproved as boolean | undefined;
    if (adminApproved === undefined)
      throw new BadRequestException(
        'Please specify boolean value adminApproved',
      );

    await this.prisma.volunteerOpportunityEnrollment.update({
      where: {
        volunteerId_opportunityId: {
          opportunityId: req.params.opportunityId,
          volunteerId: req.params.volunteerId,
        },
      },
      data: {
        adminApproved,
        didAttend: !adminApproved ? false : undefined,
      },
    });
  }

  @Put('admin/opportunities/:opportunityId/enrollments/:volunteerId/attendance')
  async adminUpdateEnrollmentAttendance(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    const enrollment =
      await this.prisma.volunteerOpportunityEnrollment.findUnique({
        where: {
          volunteerId_opportunityId: {
            opportunityId: req.params.opportunityId,
            volunteerId: req.params.volunteerId,
          },
        },
      });

    if (!enrollment)
      throw new NotFoundException(
        'No enrollment found from that user for that opportunity',
      );

    const didAttend = req.body.didAttend as boolean | undefined;
    if (didAttend === undefined)
      throw new BadRequestException('Please specify boolean value didAttend');

    await this.prisma.volunteerOpportunityEnrollment.update({
      where: {
        volunteerId_opportunityId: {
          opportunityId: req.params.opportunityId,
          volunteerId: req.params.volunteerId,
        },
      },
      data: {
        didAttend,
      },
    });
  }

  @Get('admin/volunteers')
  async adminGetVolunteers(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    const volunteers = await this.prisma.user.findMany({
      where: {
        role: 'VOLUNTEER',
        volunteer: { isNot: null },
      },
      include: {
        volunteer: {
          include: { VolunteerPreference: { select: { preference: true } } },
        },
      },
    });

    return volunteers;
  }

  @Get('admin/volunteers/:id')
  async adminGetVolunteer(@Req() req: RequireAuthProp<Request>) {
    // allow volunteer to access their own profile data
    req.auth.userId === req.params.id ||
      (await this.appService.checkUserIsAdmin(req.auth.userId));

    const volunteerUser = await this.appService.getUserJoinVolunteer(
      req.params.id,
    );

    if (!volunteerUser)
      throw new NotFoundException('No volunteer found with that userId');

    if (!volunteerUser.volunteer)
      throw new BadRequestException(
        'That volunteer has not created their profile',
      );

    const enrollments =
      await this.prisma.volunteerOpportunityEnrollment.findMany({
        where: {
          volunteerId: req.params.id,
        },
        include: {
          opportunity: true,
        },
      });

    return { ...volunteerUser, enrollments };
  }

  @Get('admin/report-data')
  async adminGetReportData(@Req() req: RequireAuthProp<Request>) {
    await this.appService.checkUserIsAdmin(req.auth.userId);

    const [volunteers, opportunities, enrollments] = await Promise.all([
      this.prisma.volunteer.findMany({
        include: {
          VolunteerPreference: {
            select: {
              preference: true,
            },
          },
          VolunteerOpportunityEnrollment: {
            include: {
              opportunity: true,
            },
          },
        },
      }),
      this.prisma.opportunity.findMany({
        include: {
          VolunteerOpportunityEnrollment: {
            include: {
              volunteer: {
                include: {
                  VolunteerPreference: {
                    select: {
                      preference: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.volunteerOpportunityEnrollment.findMany({
        include: {
          opportunity: true,
          volunteer: {
            include: {
              VolunteerPreference: {
                select: {
                  preference: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      volunteers,
      opportunities,
      enrollments,
    };
  }
}
