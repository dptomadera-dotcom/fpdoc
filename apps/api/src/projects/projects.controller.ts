import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { ProjectsService } from './projects.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, ProjectStatus } from '@prisma/client';

class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  cycleId: string;

  @IsString()
  year: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  moduleIds?: string[];
}

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR, UserRole.ALUMNO)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR, UserRole.ALUMNO)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  create(@Body() data: CreateProjectDto) {
    return this.projectsService.create(data);
  }

  @Post(':id/phases')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  addPhase(@Param('id') id: string, @Body() data: { name: string; description?: string; order: number }) {
    return this.projectsService.addPhase(id, data);
  }

  @Post('phases/:phaseId/tasks')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  addTask(@Param('phaseId') phaseId: string, @Body() data: CreateTaskDto) {
    return this.projectsService.addTask(phaseId, data);
  }
}
