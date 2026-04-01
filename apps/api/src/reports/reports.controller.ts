import { 
  Controller, 
  Get, 
  Param, 
  Res, 
  UseGuards 
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('project/:id/pdf')
  @Roles(UserRole.ADMIN, UserRole.JEFATURA, UserRole.PROFESOR)
  async downloadProjectReport(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const buffer = await this.reportsService.generateProjectReport(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte-proyecto-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
