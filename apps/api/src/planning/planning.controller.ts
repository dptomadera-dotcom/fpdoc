import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards
} from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';
import { PlanningService } from './planning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

class CreateSessionDto {
  @IsString()
  groupId: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

@Controller('planning')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Get('sessions')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR, UserRole.ALUMNO)
  async getSessions(
    @Query('groupId') groupId: string,
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    return this.planningService.getGroupSessions(
      groupId,
      new Date(start),
      new Date(end)
    );
  }

  @Get('calendar')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR, UserRole.ALUMNO)
  async getCalendar(
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    return this.planningService.getCalendar(
      new Date(start),
      new Date(end)
    );
  }

  @Post('sessions')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  async createSession(@Body() data: CreateSessionDto) {
    return this.planningService.createSession({
      ...data,
      date: new Date(data.date),
    });
  }

  @Post('holidays')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA)
  async markHoliday(@Body() data: { date: string; label: string }) {
    return this.planningService.markHoliday(
      new Date(data.date),
      data.label
    );
  }
}
