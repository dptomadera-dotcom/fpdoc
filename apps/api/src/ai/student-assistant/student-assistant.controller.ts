import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StudentAssistantService } from './student-assistant.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('ai/student-assistant')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentAssistantController {
  constructor(private readonly service: StudentAssistantService) {}

  @Post()
  @Roles(UserRole.ALUMNO, UserRole.ADMIN)
  async ask(
    @Body()
    body: {
      message: string;
      route?: string;
      entityType?: string;
      entityId?: string;
    },
    @Request() req: any,
  ) {
    return { response: await this.service.ask(body, req.user.userId) };
  }
}
