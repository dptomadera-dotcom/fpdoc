import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

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
  create(@Body() data: any) {
    return this.projectsService.create(data);
  }

  @Post(':id/phases')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  addPhase(@Param('id') id: string, @Body() data: { name: string; description?: string; order: number }) {
    return this.projectsService.addPhase(id, data);
  }

  @Post('phases/:phaseId/tasks')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  addTask(@Param('phaseId') phaseId: string, @Body() data: any) {
    return this.projectsService.addTask(phaseId, data);
  }
}
