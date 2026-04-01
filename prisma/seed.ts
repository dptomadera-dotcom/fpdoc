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

  // 4. Cycle (MAM201 - Instalación y Amueblamiento - Grado Medio)
  const cycle = await prisma.cycle.upsert({
    where: { code: 'MAM201' },
    update: {},
    create: {
      name: 'Instalación y Amueblamiento',
      code: 'MAM201',
      grade: 'MEDIO',
      hours: 2000,
      familyId: family.id,
      bocRef: 'Real Decreto 1146/2011',
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
      name: '1º Instalación A',
      courseId: course1.id,
    },
  });

  // 7. Modules (Real Grado Medio Woodwork)
  const moduleMecanizado = await prisma.module.upsert({
    where: { code: '0432' },
    update: {},
    create: {
      name: 'Mecanizado de madera y derivados',
      code: '0432',
      hours: 230,
      year: 1,
      cycleId: cycle.id,
    },
  });

  const moduleMontaje = await prisma.module.upsert({
    where: { code: '0434' },
    update: {},
    create: {
      name: 'Montaje de muebles y elementos de carpintería',
      code: '0434',
      hours: 210,
      year: 1,
      cycleId: cycle.id,
    },
  });

  const moduleAcabados = await prisma.module.upsert({
    where: { code: '0436' },
    update: {},
    create: {
      name: 'Acabados en madera',
      code: '0436',
      hours: 140,
      year: 1,
      cycleId: cycle.id,
    },
  });

  // 8. Learning Outcomes (RA) & Evaluation Criteria (CE)
  
  // RA for Mecanizado
  const raMecanizado1 = await prisma.learningOutcome.create({
    data: {
      code: 'RA1',
      description: 'Prepara máquinas y equipos de mecanizado, identificando sus componentes y funciones.',
      moduleId: moduleMecanizado.id,
    },
  });

  await prisma.evaluationCriterion.createMany({
    data: [
      { code: 'CE1.a', description: 'Se han identificado los órganos de mando y control de las máquinas.', learningOutcomeId: raMecanizado1.id },
      { code: 'CE1.b', description: 'Se han seleccionado las herramientas adecuadas al proceso.', learningOutcomeId: raMecanizado1.id },
      { code: 'CE1.c', description: 'Se han realizado las operaciones de puesta a punto.', learningOutcomeId: raMecanizado1.id },
    ],
  });

  // RA for Montaje
  const raMontaje1 = await prisma.learningOutcome.create({
    data: {
      code: 'RA1',
      description: 'Prepara el montaje de muebles, interpretando planos y seleccionando materiales.',
      moduleId: moduleMontaje.id,
    },
  });

  await prisma.evaluationCriterion.createMany({
    data: [
      { code: 'CE1.a', description: 'Ha interpretado correctamente los planos de montaje.', learningOutcomeId: raMontaje1.id },
      { code: 'CE1.b', description: 'Ha identificado las piezas y herrajes necesarios.', learningOutcomeId: raMontaje1.id },
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
          { moduleId: moduleMecanizado.id },
          { moduleId: moduleMontaje.id },
        ],
      },
      phases: {
        create: [
          {
            name: 'Fase 1: Preparación y Mecanizado',
            description: 'Puesta a punto de máquinas y primer despiece.',
            order: 1,
            tasks: {
              create: [
                {
                  title: 'Ajuste de escuadradora',
                  description: 'Preparar la máquina para el corte de tableros.',
                  status: TaskStatus.EN_CURSO,
                  assignedToId: professor.id,
                  toolLevel: ToolLevel.TALLER,
                  curriculumLinks: {
                    create: [
                      {
                        learningOutcomeId: raMecanizado1.id,
                      }
                    ]
                  }
                },
                {
                  title: 'Corte de piezas base',
                  description: 'Realizar el corte de las piezas según el plano.',
                  status: TaskStatus.PENDIENTE,
                  assignedToId: professor.id,
                }
              ]
            }
          },
          {
            name: 'Fase 2: Montaje y Ajuste',
            description: 'Encolado y montaje de la estructura.',
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
