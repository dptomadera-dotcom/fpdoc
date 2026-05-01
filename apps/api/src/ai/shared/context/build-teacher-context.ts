import { PrismaService } from '../../../prisma/prisma.service';

export interface TeacherContext {
  projects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    phases: Array<{
      name: string;
      tasks: Array<{ title: string; status: string }>;
    }>;
  }>;
  groups: Array<{ id: string; name?: string; studentCount: number }>;
}

export async function buildTeacherContext(
  prisma: PrismaService,
  userId: string,
): Promise<TeacherContext> {
  const assignments = await prisma.teachingAssignment.findMany({
    where: { teacherId: userId },
    select: { groupId: true },
  });

  const groupIds = [...new Set(assignments.map((a) => a.groupId))];

  if (groupIds.length === 0) {
    return { projects: [], groups: [] };
  }

  const groupsData = await prisma.group.findMany({
    where: { id: { in: groupIds } },
    include: {
      Course: {
        include: {
          Project: {
            include: {
              ProjectPhase: {
                include: { Task: { select: { title: true, status: true } } },
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      },
      _count: { select: { StudentGroup: true } },
    },
  });

  const seenProjectIds = new Set<string>();
  const projects: TeacherContext['projects'] = [];

  for (const group of groupsData) {
    for (const project of group.Course.Project) {
      if (seenProjectIds.has(project.id)) continue;
      seenProjectIds.add(project.id);

      const allTasks = project.ProjectPhase.flatMap((ph) => ph.Task);
      const completed = allTasks.filter((t) => t.status === 'VALIDADO').length;
      const progress =
        allTasks.length > 0
          ? Math.round((completed / allTasks.length) * 100)
          : 0;

      projects.push({
        id: project.id,
        name: project.name,
        status: project.status,
        progress,
        phases: project.ProjectPhase.map((ph) => ({
          name: ph.name,
          tasks: ph.Task.map((t) => ({ title: t.title, status: t.status })),
        })),
      });
    }
  }

  return {
    projects: projects.slice(0, 5),
    groups: groupsData.map((g) => ({
      id: g.id,
      name: g.name,
      studentCount: g._count.StudentGroup,
    })),
  };
}
