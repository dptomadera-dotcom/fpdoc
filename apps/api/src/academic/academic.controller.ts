import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AcademicService } from './academic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('academic')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get('projects')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR, UserRole.ALUMNO)
  getProjects() {
    return this.academicService.getProjects();
  }

  @Get('modules')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  getModules() {
    return this.academicService.getModules();
  }

  @Get('cycles')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR, UserRole.ALUMNO)
  getCycles() {
    return this.academicService.getCycles();
  }

  @Get('groups')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  getGroups() {
    return this.academicService.getGroups();
  }

  @Post('projects')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  createProject(@Body() data: any) {
    return this.academicService.createProject(data);
  }
}
