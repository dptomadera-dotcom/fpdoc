import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CurriculumReviewService } from './curriculum-review.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('ai/curriculum-review')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CurriculumReviewController {
  constructor(private readonly service: CurriculumReviewService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESOR, UserRole.JEFATURA)
  async review(
    @Body()
    body: {
      moduleId?: string;
      projectId?: string;
      route?: string;
    },
    @Request() req: any,
  ) {
    return this.service.review(body, req.user.userId);
  }
}
