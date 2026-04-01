import { PrismaClient, UserRole, ProjectStatus, ToolLevel, TaskStatus, EvaluationPeriod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync('password123', 10);
  console.log('🌱 Starting seed...');

  // 1. Center
  const center = await prisma.center.upsert({
    where: { code: 'CMAD01' },
    update: {},
    create: {
      name: 'Centro Integrado de FP Madera y Corcho',
      code: 'CMAD01',
    },
  });

  // 2. Department
  const department = await prisma.department.create({
    data: {
      name: 'Departamento de Madera',
      centerId: center.id,
    },
  });

  // 3. Family
  const family = await prisma.family.upsert({
    where: { code: 'MAM' },
    update: {},
    create: {
      name: 'Madera, Mueble y Corcho',
      code: 'MAM',
      departmentId: department.id,
    },
  });

  // 4. Cycle
  const cycle = await prisma.cycle.upsert({
    where: { code: 'MAM301' },
    update: {},
    create: {
      name: 'Diseño y Amueblamiento',
      code: 'MAM301',
      grade: 'SUPERIOR',
      hours: 2000,
      familyId: family.id,
      bocRef: 'Real Decreto 1579/2011',
    },
  });

  // 5. Courses
  const course1 = await prisma.course.create({
    data: {
      year: 1,
      cycleId: cycle.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      year: 2,
      cycleId: cycle.id,
    },
  });

  // 6. Group
  const group1A = await prisma.group.create({
    data: {
      name: '1º Diseño A',
      courseId: course1.id,
    },
  });

  // 7. Modules
  const module1 = await prisma.module.upsert({
    where: { code: '0401' },
    update: {},
    create: {
      name: 'Materiales en carpintería y mueble',
      code: '0401',
      hours: 160,
      year: 1,
      cycleId: cycle.id,
    },
  });

  const module2 = await prisma.module.upsert({
    where: { code: '0403' },
    update: {},
    create: {
      name: 'Diseño de productos de carpintería y mueble',
      code: '0403',
      hours: 190,
      year: 1,
      cycleId: cycle.id,
    },
  });

  // 8. Learning Outcomes (RA) & Evaluation Criteria (CE)
  const ra1 = await prisma.learningOutcome.create({
    data: {
      code: 'RA1',
      description: 'Identifica los materiales de madera y sus derivados, analizando sus propiedades y aplicaciones.',
      moduleId: module1.id,
    },
  });

  await prisma.evaluationCriterion.createMany({
    data: [
      { code: 'CE1.a', description: 'Ha identificado las especies de madera más utilizadas.', learningOutcomeId: ra1.id },
      { code: 'CE1.b', description: 'Ha analizado las propiedades físico-mecánicas de la madera.', learningOutcomeId: ra1.id },
    ],
  });

  const ra2 = await prisma.learningOutcome.create({
    data: {
      code: 'RA1',
      description: 'Define la documentación técnica de productos de mobiliario.',
      moduleId: module2.id,
    },
  });

  await prisma.evaluationCriterion.createMany({
    data: [
      { code: 'CE1.a', description: 'Ha elaborado planos de conjunto y despiece.', learningOutcomeId: ra2.id },
      { code: 'CE1.b', description: 'Ha definido las especificaciones de materiales.', learningOutcomeId: ra2.id },
    ],
  });

  // 9. Users
  const professor = await prisma.user.upsert({
    where: { email: 'profe@ejemplo.com' },
    update: { passwordHash },
    create: {
      email: 'profe@ejemplo.com',
      passwordHash,
      firstName: 'Juan',
      lastName: 'Profesor',
      role: UserRole.PROFESOR,
      centerId: center.id,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'alumno@ejemplo.com' },
    update: { passwordHash },
    create: {
      email: 'alumno@ejemplo.com',
      passwordHash,
      firstName: 'Carlos',
      lastName: 'Alumno',
      role: UserRole.ALUMNO,
      centerId: center.id,
    },
  });

  // Enroll student
  await prisma.studentGroup.create({
    data: {
      userId: student.id,
      groupId: group1A.id,
    },
  });

  // 10. Project (Test)
  const project = await prisma.project.create({
    data: {
      name: 'Proyecto Silla Ergonómica 2024',
      description: 'Diseño y prototipado de una silla ergonómica utilizando maderas sostenibles.',
      status: ProjectStatus.ACTIVO,
      courseId: course1.id,
      evaluationPeriod: EvaluationPeriod.PRIMERA,
      toolLevel: ToolLevel.TALLER,
      estimatedHours: 40,
      projectModules: {
        create: [
          { moduleId: module1.id },
          { moduleId: module2.id },
        ],
      },
      phases: {
        create: [
          {
            name: 'Fase 1: Investigación y Diseño',
            description: 'Selección de materiales y creación de planos.',
            order: 1,
            tasks: {
              create: [
                {
                  title: 'Selección de maderas',
                  description: 'Investigar y elegir la madera adecuada según el diseño.',
                  status: TaskStatus.EN_CURSO,
                  assignedToId: professor.id,
                  toolLevel: ToolLevel.MANUAL,
                },
                {
                  title: 'Dibujo de planos',
                  description: 'Realizar despiece completo en CAD.',
                  status: TaskStatus.PENDIENTE,
                  assignedToId: professor.id,
                }
              ]
            }
          },
          {
            name: 'Fase 2: Prototipado',
            description: 'Construcción del primer prototipo a escala.',
            order: 2,
          }
        ]
      }
    },
  });

  console.log('✅ Seed completed successfully');
  console.log(`Created Project: ${project.name} (${project.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
