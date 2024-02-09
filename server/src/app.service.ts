import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async getUser(clerkUserId: string) {
    return await this.prisma.user.findUnique({
      where: {
        clerkUserId,
      },
    });
  }

  async getUserJoinVolunteer(clerkUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        clerkUserId,
      },
      include: {
        volunteer: {
          include: {
            VolunteerPreference: {
              select: { preference: true },
            },
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
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId },
      include: { volunteer: true },
    });
    if (!user || user.role !== 'VOLUNTEER') throw new ForbiddenException();

    if (!user.volunteer)
      throw new BadRequestException(
        'You need to create your profile first! Go to "My Profile"',
      );
  }

  async generateCertificate(replace: {
    volunteer: string;
    hours: string;
    event: string;
    date: string;
    generatedTime: string;
  }) {
    const folderPath = `${__dirname}/tmp`;
    // console.log(folderPath);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    const html = fs.readFileSync(`static/certificate-template.html`, 'utf8');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const replacedHtml = html.replace(/{{(.+?)}}/g, (_, g1) => replace[g1]);
    await page.setContent(replacedHtml);

    const filePath = `${folderPath}/${uuidv4()}.pdf`;

    await page.pdf({
      path: filePath,
      height: 720,
      width: 1080,
      printBackground: true,
    });

    await browser.close();

    this.logger.log(`Here's your PDF! ${filePath}`);
    return filePath;
  }
}
