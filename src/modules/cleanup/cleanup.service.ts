import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  private BATCH_SIZE: number;

  constructor(private readonly prisma: PrismaService) {
    this.BATCH_SIZE = 1000;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    await Promise.all([
      this.cleanupPasswordResetToken(),
      this.cleanupEmailVerificationCode(),
    ]);
  }

  private async cleanupPasswordResetToken() {
    const now = new Date();

    while (true) {
      const tokens = await this.prisma.passwordResetToken.findMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
        select: {
          id: true,
        },
        take: this.BATCH_SIZE,
      });

      if (!tokens.length) {
        break;
      }

      await this.prisma.passwordResetToken.deleteMany({
        where: {
          id: {
            in: tokens.map((token) => token.id),
          },
        },
      });
    }
  }

  private async cleanupEmailVerificationCode() {
    const now = new Date();

    while (true) {
      const tokens = await this.prisma.emailVerificationCode.findMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
        select: {
          id: true,
        },
        take: this.BATCH_SIZE,
      });

      if (!tokens.length) {
        break;
      }

      await this.prisma.emailVerificationCode.deleteMany({
        where: {
          id: {
            in: tokens.map((token) => token.id),
          },
        },
      });
    }
  }
}
