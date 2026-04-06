import { PrismaService } from '../../../prisma/prisma.service';

export interface StudentContext {
  pendingTasks: Array<{
    title: string;
    description?: string;
    status: string;
    dueDate?: string;
    phase: string;
    project: string;
  }>;
  progress: Array<{ projectName: string; completedTasks: number; totalTasks: number }>;
}

export async function buildStudentContext(
  prisma: PrismaService,
  userId: string,
): Promise<StudentContext> {
  const studentGroups = await prisma.studentGroup.findMany({
    where: { studentId: userId },
    include: {
      group: {
        include: {
          course: {
            include: {
              projects: {
                include: {
                  phases: {
                    include: {
                      tasks: {
                        where: { status: { not: 'VALIDADO' } },
                        orderBy: { dueDate: 'asc' },
                        take: 10,
                      },
                    },
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const pendingTasks: StudentContext['pendingTasks'] = [];
  const progress: StudentContext['progress'] = [];

  for (const sg of studentGroups) {
    for (const project of sg.group.course.projects) {
      let completedTasks = 0;
      let totalTasks = 0;

      for (const phase of project.phases) {
        totalTasks += phase.tasks.length;
        for (const task of phase.tasks) {
          if (task.status === 'VALIDADO') {
            completedTasks++;
          } else {
            pendingTasks.push({
              title: task.title,
              description: task.description ?? undefined,
              status: task.status,
              dueDate: task.dueDate?.toISOString().split('T')[0],
              phase: phase.name,
              project: project.name,
            });
          }
        }
      }

      progress.push({ projectName: project.name, completedTasks, totalTasks });
    }
  }

  return { pendingTasks: pendingTasks.slice(0, 10), progress };
}
