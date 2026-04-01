import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EvidenceStatus } from '@prisma/client';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class MonitoringService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService
  ) {}

  async submitEvidence(data: { 
    taskId: string; 
    studentId: string; 
    fileName: string; 
    fileUrl: string; 
    mimeType: string;
  }) {
    return this.prisma.evidence.create({
      data: {
        ...data,
        status: EvidenceStatus.PENDIENTE,
      },
    });
  }

  async uploadEvidence(file: Express.Multer.File, taskId: string) {
    const bucketName = 'evidences';
    const timestamp = Date.now();
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${taskId}/${timestamp}_${cleanFileName}`;

    const fileUrl = await this.supabaseService.uploadFile(
      bucketName,
      path,
      file.buffer,
      file.mimetype
    );

    return {
      url: fileUrl,
      fileName: file.originalname,
      mimeType: file.mimetype
    };
  }

  async getTaskEvidences(taskId: string) {
    return this.prisma.evidence.findMany({
      where: { taskId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        comments: {
          include: {
            // author info here if needed
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getStudentEvidences(studentId: string) {
    return this.prisma.evidence.findMany({
      where: { studentId },
      include: {
        task: {
          include: {
            phase: {
              include: {
                project: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async updateEvidenceStatus(evidenceId: string, status: EvidenceStatus) {
    return this.prisma.evidence.update({
      where: { id: evidenceId },
      data: { 
        status,
        reviewedAt: new Date(),
      },
    });
  }

  async addComment(evidenceId: string, authorId: string, content: string) {
    return this.prisma.evidenceComment.create({
      data: {
        evidenceId,
        authorId,
        content,
      },
    });
  }

  async getProjectStats(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        phases: {
          include: {
            tasks: {
              include: {
                curriculumLinks: {
                  include: {
                    learningOutcome: true,
                    evaluationCriterion: true,
                  },
                },
                assessmentRecords: true,
              },
            },
          },
        },
      },
    });

    if (!project) return null;

    const tasks = project.phases.flatMap((p) => p.tasks);
    const raStats: Record<string, { code: string; description: string; totalScore: number; count: number; criteria: Set<string>; totalCriteria: number }> = {};

    tasks.forEach((task) => {
      task.curriculumLinks.forEach((link) => {
        const raId = link.learningOutcomeId;
        if (!raStats[raId]) {
          raStats[raId] = {
            code: link.learningOutcome.code,
            description: link.learningOutcome.description,
            totalScore: 0,
            count: 0,
            criteria: new Set(),
            totalCriteria: 0, // This would ideally come from the curriculum definition
          };
        }
        if (link.evaluationCriterionId) {
          raStats[raId].criteria.add(link.evaluationCriterionId);
        }
      });

      task.assessmentRecords.forEach((record) => {
        const raId = record.learningOutcomeId;
        if (raStats[raId] && record.score !== null) {
          raStats[raId].totalScore += record.score;
          raStats[raId].count += 1;
        }
      });
    });

    return Object.entries(raStats).map(([id, stats]) => ({
      id,
      code: stats.code,
      description: stats.description,
      averageScore: stats.count > 0 ? Number((stats.totalScore / stats.count).toFixed(2)) : 0,
      evaluatedCriteria: stats.criteria.size,
      status: stats.count > 0 ? (stats.totalScore / stats.count >= 5 ? 'SUPERADO' : 'INSUFICIENTE') : 'PENDIENTE',
    }));
  }

  async submitAssessment(data: {
    evidenceId: string;
    status: EvidenceStatus;
    teacherId: string;
    comment?: string;
    scores: { curriculumLinkId: string; score: number }[];
  }) {
    const evidence = await this.prisma.evidence.findUnique({
      where: { id: data.evidenceId },
      include: { task: true },
    });

    if (!evidence) throw new Error('Evidence not found');

    // 1. Update evidence status
    await this.updateEvidenceStatus(data.evidenceId, data.status);

    // 2. Add teacher comment
    if (data.comment) {
      await this.addComment(data.evidenceId, data.teacherId, data.comment);
    }

    // 3. Create assessment records
    if (data.status === EvidenceStatus.ACEPTADA) {
      for (const item of data.scores) {
        const link = await this.prisma.taskCurriculumLink.findUnique({
          where: { id: item.curriculumLinkId },
        });

        if (link) {
          await this.prisma.assessmentRecord.create({
            data: {
              studentId: evidence.studentId,
              taskId: evidence.taskId,
              learningOutcomeId: link.learningOutcomeId,
              evaluationCriterionId: link.evaluationCriterionId,
              score: item.score,
              assessedById: data.teacherId,
            },
          });
        }
      }

      // 4. Update task status if accepted
      await this.prisma.task.update({
        where: { id: evidence.taskId },
        data: { status: 'VALIDADO' as any }, // Using string cast for TaskStatus
      });
    }

    return { success: true };
  }
}
