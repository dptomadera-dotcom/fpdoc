import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MonitoringService } from './monitoring.service';
import { CheckEvidenceDto } from './dto/check-evidence.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, EvidenceStatus } from '@prisma/client';

class SubmitEvidenceDto {
  @IsString()
  taskId: string;

  @IsString()
  fileName: string;

  @IsString()
  fileUrl: string;

  @IsString()
  mimeType: string;
}

@Controller('monitoring')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Post('upload-evidence')
  @Roles(UserRole.ALUMNO)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('taskId') taskId: string
  ) {
    return this.monitoringService.uploadEvidence(file, taskId);
  }

  @Post('evidence')
  @Roles(UserRole.ALUMNO)
  async submitEvidence(@Request() req: any, @Body() data: SubmitEvidenceDto) {
    return this.monitoringService.submitEvidence({
      ...data,
      studentId: req.user.id,
    });
  }

  @Get('tasks/:taskId/evidences')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  async getTaskEvidences(@Param('taskId') taskId: string) {
    return this.monitoringService.getTaskEvidences(taskId);
  }

  @Get('student/evidences')
  @Roles(UserRole.ALUMNO)
  async getStudentEvidences(@Request() req: any) {
    return this.monitoringService.getStudentEvidences(req.user.id);
  }

  @Get('project/:projectId/stats')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  async getProjectStats(@Param('projectId') projectId: string) {
    return this.monitoringService.getProjectStats(projectId);
  }

  @Patch('evidence/:id/status')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: EvidenceStatus
  ) {
    return this.monitoringService.updateEvidenceStatus(id, status);
  }

  @Post('check-evidence')
  @Roles(UserRole.ADMIN, UserRole.PROFESOR)
  async checkEvidence(@Request() req: any, @Body() data: CheckEvidenceDto) {
    return this.monitoringService.submitAssessment({
      ...data,
      teacherId: req.user.id,
    });
  }

  @Post('evidence/:id/comment')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR, UserRole.ALUMNO)
  async addComment(
    @Request() req: any,
    @Param('id') id: string,
    @Body('content') content: string
  ) {
    return this.monitoringService.addComment(id, req.user.id, content);
  }
}
