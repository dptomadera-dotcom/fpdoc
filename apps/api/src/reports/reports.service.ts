import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MonitoringService } from '../monitoring/monitoring.service';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');


@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private monitoringService: MonitoringService
  ) {}

  async generateProjectReport(projectId: string): Promise<Buffer> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        course: { include: { cycle: true } },
        projectModules: { include: { module: true } },
      },
    });

    if (!project) throw new Error('Project not found');

    const stats = await this.monitoringService.getProjectStats(projectId);

    return new Promise(async (resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));

      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // --- PDF CONTENT ---
      
      // Header
      doc.fillColor('#1e293b').fontSize(24).text('INFORME DE PROYECTO TRANSVERSAL', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Fecha de generación: ${new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown(2);

      // Project Info
      doc.rect(50, doc.y, 500, 100).fill('#f8fafc');
      doc.fillColor('#000000').fontSize(14).text('Detalles del Proyecto', 60, doc.y + 10);
      doc.fontSize(10).text(`Nombre: ${project.name}`, 60, doc.y + 10);
      doc.text(`Ciclo: ${project.course.cycle.name}`, 60, doc.y + 5);
      doc.text(`Estado: ${project.status}`, 60, doc.y + 5);
      doc.moveDown(4);

      // Stats Section
      doc.fontSize(14).text('Rendimiento por Competencias (RA)', 50, doc.y);
      doc.moveDown();

      if (stats && stats.length > 0) {
        stats.forEach((ra: any) => {
          doc.fontSize(12).fillColor('#1e293b').text(`${ra.code}: ${ra.description}`);
          doc.fontSize(10).fillColor('#64748b').text(`Nota Media: ${ra.averageScore.toFixed(1)} / 10 | Criterios Evaluados: ${ra.evaluatedCriteria}`);
          
          // Progress bar
          const barWidth = 400;
          const progressPercent = Math.min((ra.averageScore / 10), 1);
          const progressWidth = Math.max(progressPercent * barWidth, 0);
          
          const currentY = doc.y;
          doc.rect(50, currentY + 5, barWidth, 10).fill('#e2e8f0');
          doc.rect(50, currentY + 5, progressWidth, 10).fill(ra.averageScore >= 5 ? '#10b981' : '#f43f5e');
          
          doc.moveDown(3);
        });
      } else {
        doc.fontSize(10).fillColor('#64748b').text('No hay datos de evaluación suficientes para generar el desglose competencial.');
        doc.moveDown(2);
      }

      // Add a page for Evidence
      doc.addPage();
      doc.fontSize(14).fillColor('#1e293b').text('Registro de Evidencias Entregadas', 50, 50);
      doc.moveDown();

      const evidences = await this.prisma.evidence.findMany({
        where: { task: { phase: { projectId } } },
        include: { 
          task: true, 
          student: true 
        },
        orderBy: { submittedAt: 'desc' }
      });

      if (evidences.length > 0) {
        for (const ev of evidences) {
          const studentName = ev.student ? `${ev.student.firstName} ${ev.student.lastName}` : 'Anónimo';
          
          // Get grade for this specific student and task
          const records = await this.prisma.assessmentRecord.findMany({
            where: { taskId: ev.taskId, studentId: ev.studentId }
          });
          
          const grade = records.length > 0 
            ? (records.reduce((acc, curr) => acc + (curr.score || 0), 0) / records.length).toFixed(1)
            : 'Pendiente';

          doc.fontSize(10).fillColor('#1e293b').text(`Sometido por: ${studentName}`);
          doc.fontSize(9).fillColor('#64748b').text(`Tarea: ${ev.task.title} | Calificación: ${grade}`);
          doc.moveDown();

          if (doc.y > 700) doc.addPage();
        }
      } else {
        doc.fontSize(10).fillColor('#64748b').text('No se han registrado evidencias de entrega para este proyecto.');
      }

      // Footer
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(`Página ${i + 1} de ${range.count}`, 50, 750, { align: 'center' });
      }

      doc.end();
    });
  }
}
