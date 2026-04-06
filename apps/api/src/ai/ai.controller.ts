import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('suggest')
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  async suggest(
    @Body()
    data: {
      title: string;
      description: string;
      raIds: string[];
      ceIds: string[];
      route?: string;
    },
    @Request() req: any,
  ) {
    return this.ai.suggestProjectStructure(data, req.user.userId);
  }

  @Post('teacher-assistant')
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  async teacherAssistant(
    @Body()
    data: {
      message: string;
      route?: string;
      entityType?: string;
      entityId?: string;
    },
    @Request() req: any,
  ) {
    return { response: await this.ai.askTeacherAssistant(data, req.user.userId) };
  }
}
