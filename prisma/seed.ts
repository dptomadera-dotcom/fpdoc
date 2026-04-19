import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync('password123', 10);
  console.log('Iniciando seed — Dpto. Madera, Mueble y Corcho 2025-2026...');

  // 1. AÑO ACADÉMICO
  const academicYear = await prisma.academicYear.upsert({
    where: { label: '2025-2026' },
    update: { isCurrent: true },
    create: {
      id: 'ay-2025-2026',
      label: '2025-2026',
      startDate: new Date('2025-09-15'),
      endDate: new Date('2026-06-20'),
      isCurrent: true,
    },
  });

  // 2. CENTRO
  const center = await prisma.center.upsert({
    where: { code: 'CMAD01' },
    update: {},
    create: {
      id: 'center-01',
      name: 'Centro Integrado de FP Madera y Corcho',
      code: 'CMAD01',
    },
  });

  // 3. DEPARTAMENTO
  const department = await prisma.department.upsert({
    where: { id: 'dept-madera' },
    update: {},
    create: {
      id: 'dept-madera',
      name: 'Departamento de Madera, Mueble y Corcho',
      centerId: center.id,
    },
  });

  // 4. FAMILIA PROFESIONAL
  const family = await prisma.family.upsert({
    where: { code: 'MAM' },
    update: {},
    create: {
      id: 'family-mam',
      name: 'Madera, Mueble y Corcho',
      code: 'MAM',
      departmentId: department.id,
    },
  });

  // 5. CICLOS
  const cycleCFGB = await prisma.cycle.upsert({
    where: { code: 'FPB-MAM' },
    update: {},
    create: { id: 'cycle-cfgb', name: 'FPB Carpinteria y Mueble', code: 'FPB-MAM', grade: 'BASICO', hours: 2000, familyId: family.id, bocRef: 'BOC 2023 CFGB Madera' },
  });
  const cycleCFGM = await prisma.cycle.upsert({
    where: { code: 'CFGM-CAM' },
    update: {},
    create: { id: 'cycle-cfgm', name: 'Carpinteria y Mueble (GM)', code: 'CFGM-CAM', grade: 'MEDIO', hours: 2000, familyId: family.id, bocRef: 'BOC-A-2024-226-3747' },
  });
  const cycleCFGS = await prisma.cycle.upsert({
    where: { code: 'CFGS-DYA' },
    update: {},
    create: { id: 'cycle-cfgs', name: 'Diseno y Amueblamiento (GS)', code: 'CFGS-DYA', grade: 'SUPERIOR', hours: 2000, familyId: family.id, bocRef: 'BOC-A-2024-226-3747' },
  });

  // 6. CURSOS
  const courses = {
    cfgb1: await prisma.course.upsert({ where: { id: 'course-cfgb-1' }, update: {}, create: { id: 'course-cfgb-1', year: 1, cycleId: cycleCFGB.id } }),
    cfgb2: await prisma.course.upsert({ where: { id: 'course-cfgb-2' }, update: {}, create: { id: 'course-cfgb-2', year: 2, cycleId: cycleCFGB.id } }),
    cfgm1: await prisma.course.upsert({ where: { id: 'course-cfgm-1' }, update: {}, create: { id: 'course-cfgm-1', year: 1, cycleId: cycleCFGM.id } }),
    cfgm2: await prisma.course.upsert({ where: { id: 'course-cfgm-2' }, update: {}, create: { id: 'course-cfgm-2', year: 2, cycleId: cycleCFGM.id } }),
    cfgs1: await prisma.course.upsert({ where: { id: 'course-cfgs-1' }, update: {}, create: { id: 'course-cfgs-1', year: 1, cycleId: cycleCFGS.id } }),
    cfgs2: await prisma.course.upsert({ where: { id: 'course-cfgs-2' }, update: {}, create: { id: 'course-cfgs-2', year: 2, cycleId: cycleCFGS.id } }),
  };

  // 7. GRUPOS
  const groups = {
    cfgb1: await prisma.group.upsert({ where: { id: 'group-1cfgb' }, update: {}, create: { id: 'group-1cfgb', name: '1 CFGB', courseId: courses.cfgb1.id } }),
    cfgb2: await prisma.group.upsert({ where: { id: 'group-2cfgb' }, update: {}, create: { id: 'group-2cfgb', name: '2 CFGB', courseId: courses.cfgb2.id } }),
    cfgm1: await prisma.group.upsert({ where: { id: 'group-1cfgm' }, update: {}, create: { id: 'group-1cfgm', name: '1 CFGM', courseId: courses.cfgm1.id } }),
    cfgm2: await prisma.group.upsert({ where: { id: 'group-2cfgm' }, update: {}, create: { id: 'group-2cfgm', name: '2 CFGM', courseId: courses.cfgm2.id } }),
    cfgs1: await prisma.group.upsert({ where: { id: 'group-1cfgs' }, update: {}, create: { id: 'group-1cfgs', name: '1 CFGS', courseId: courses.cfgs1.id } }),
    cfgs2: await prisma.group.upsert({ where: { id: 'group-2cfgs' }, update: {}, create: { id: 'group-2cfgs', name: '2 CFGS', courseId: courses.cfgs2.id } }),
  };
  console.log('Grupos:', Object.values(groups).map(g => g.name).join(', '));

  // 8. MÓDULOS
  const mod = async (id: string, code: string, name: string, hours: number, year: number, cycleId: string) =>
    prisma.module.upsert({ where: { code }, update: {}, create: { id, code, name, hours, year, cycleId } });

  // 1 CFGB
  await mod('mod-opz', 'OPZ', 'Operaciones basicas de mecanizado de madera y derivados', 200, 1, cycleCFGB.id);
  await mod('mod-tpz', 'TPZ', 'Tapizado de muebles', 130, 1, cycleCFGB.id);
  await mod('mod-mlu', 'MLU', 'Materiales y productos textiles', 130, 1, cycleCFGB.id);
  await mod('mod-le1', 'LE1', 'Lengua castellana y ciencias sociales I', 165, 1, cycleCFGB.id);
  await mod('mod-mxt', 'MXT', 'Matematicas y ciencias aplicadas I', 100, 1, cycleCFGB.id);
  await mod('mod-le2', 'LE2', 'Lengua extranjera de iniciacion profesional I', 65, 1, cycleCFGB.id);
  await mod('mod-pxe', 'PXE', 'Prevencion y salud laboral', 65, 1, cycleCFGB.id);
  await mod('mod-abt', 'ABT', 'Actividad fisica y bienestar emocional', 65, 1, cycleCFGB.id);
  // 2 CFGB
  await mod('mod-abd', 'ABD', 'Acabados basicos de la madera', 200, 2, cycleCFGB.id);
  await mod('mod-ilb', 'ILB', 'Instalacion de elementos de carpinteria y mueble', 200, 2, cycleCFGB.id);
  await mod('mod-nci', 'NCI', 'Atencion al cliente', 100, 2, cycleCFGB.id);
  // 1 CFGM
  await mod('mod-cda', 'CDA', 'Control de almacen', 130, 1, cycleCFGM.id);
  await mod('mod-dhi', 'DHI', 'Digitalizacion aplicada a los sectores productivos I', 100, 1, cycleCFGM.id);
  await mod('mod-ijk', 'IJK', 'Ingles profesional GM', 65, 1, cycleCFGM.id);
  await mod('mod-itk', 'ITK', 'Itinerario personal para la empleabilidad I', 65, 1, cycleCFGM.id);
  await mod('mod-mrn', 'MRN', 'Materiales en carpinteria y mueble', 165, 1, cycleCFGM.id);
  await mod('mod-oaa', 'OAA', 'Operaciones basicas de mobiliario de carpinteria', 200, 1, cycleCFGM.id);
  await mod('mod-opp', 'OPP', 'Operaciones basicas de carpinteria', 200, 1, cycleCFGM.id);
  await mod('mod-sov', 'SOV', 'Soluciones constructivas', 165, 1, cycleCFGM.id);
  // 2 CFGM
  await mod('mod-aad', 'AAD', 'Acabados en carpinteria y mueble', 200, 2, cycleCFGM.id);
  await mod('mod-dcu', 'DCU', 'Documentacion tecnica en carpinteria y mueble', 130, 2, cycleCFGM.id);
  await mod('mod-ipw', 'IPW', 'Itinerario personal para la empleabilidad II', 65, 2, cycleCFGM.id);
  await mod('mod-mcp', 'MCP', 'Mecanizado por control numerico en carpinteria y mueble', 165, 2, cycleCFGM.id);
  await mod('mod-mcr', 'MCR', 'Mecanizado de madera y derivados', 230, 2, cycleCFGM.id);
  await mod('mod-mjc', 'MJC', 'Montaje de carpinteria y mueble', 200, 2, cycleCFGM.id);
  await mod('mod-pvw', 'PVW', 'Proyecto intermodular aplicado al sistema productivo', 130, 2, cycleCFGM.id);
  await mod('mod-soj', 'SOJ', 'Sostenibilidad aplicada al sistema productivo', 65, 2, cycleCFGM.id);
  // 1 CFGS
  await mod('mod-djk', 'DJK', 'Digitalizacion aplicada a los sectores productivos GS', 100, 1, cycleCFGS.id);
  await mod('mod-drp', 'DRP', 'Desarrollo de producto en carpinteria y mueble', 200, 1, cycleCFGS.id);
  await mod('mod-fat', 'FAT', 'Fabricacion en carpinteria y mueble', 200, 1, cycleCFGS.id);
  await mod('mod-ikl', 'IKL', 'Ingles profesional GS', 65, 1, cycleCFGS.id);
  await mod('mod-itk-gs', 'ITK-GS', 'Itinerario personal para la empleabilidad I GS', 65, 1, cycleCFGS.id);
  await mod('mod-pmb', 'PMB', 'Prototipos en carpinteria y mueble', 200, 1, cycleCFGS.id);
  await mod('mod-pub', 'PUB', 'Procesos en industrias de carpinteria y mueble', 165, 1, cycleCFGS.id);
  await mod('mod-rrc', 'RRC', 'Representacion en carpinteria y mobiliario', 165, 1, cycleCFGS.id);
  // 2 CFGS
  await mod('mod-atz', 'ATZ', 'Automatizacion en carpinteria y mueble', 165, 2, cycleCFGS.id);
  await mod('mod-ddr', 'DDR', 'Diseno de carpinteria y mueble', 200, 2, cycleCFGS.id);
  await mod('mod-eb1', 'EB1', 'Proyecto intermodular de diseno y amueblamiento', 130, 2, cycleCFGS.id);
  await mod('mod-gne', 'GNE', 'Gestion de la produccion en carpinteria y mueble', 130, 2, cycleCFGS.id);
  await mod('mod-ipw-gs', 'IPW-GS', 'Itinerario personal para la empleabilidad II GS', 65, 2, cycleCFGS.id);
  await mod('mod-iud', 'IUD', 'Instalacion de estructuras de madera', 165, 2, cycleCFGS.id);
  await mod('mod-iyo', 'IYO', 'Instalaciones de carpinteria y mobiliario', 200, 2, cycleCFGS.id);
  await mod('mod-soj-gs', 'SOJ-GS', 'Sostenibilidad aplicada al sistema productivo GS', 65, 2, cycleCFGS.id);
  console.log('Modulos creados');

  // 9. RA/CE — Módulo MLU completo (fuente: MLU RA.docx del departamento)
  const mluRAs = [
    {
      id: 'ra-mlu-1', code: 'RA1',
      description: 'Recepcion de materiales y productos textiles, distinguiendo sus propiedades y aplicaciones.',
      ces: [
        { id: 'ce-mlu-1a', code: 'a', description: 'Se ha verificado la correspondencia entre las mercancias recibidas y el albaran.' },
        { id: 'ce-mlu-1b', code: 'b', description: 'Se han diferenciado los materiales segun sus caracteristicas y aplicaciones.' },
        { id: 'ce-mlu-1c', code: 'c', description: 'Se han clasificado los materiales en funcion de su tamano, grosor, defectos y origen.' },
        { id: 'ce-mlu-1d', code: 'd', description: 'Se han identificado defectos y anomalias frecuentes de los materiales.' },
        { id: 'ce-mlu-1e', code: 'e', description: 'Se han descrito los procesos basicos de produccion de materiales y productos textiles.' },
        { id: 'ce-mlu-1f', code: 'f', description: 'Se han explicado las propiedades que los tratamientos confieren a las materias primas.' },
        { id: 'ce-mlu-1g', code: 'g', description: 'Se han interpretado etiquetas normalizadas de composicion y manipulacion.' },
        { id: 'ce-mlu-1h', code: 'h', description: 'Se ha comprobado que las etiquetas coinciden con las especificaciones de la ficha tecnica.' },
      ],
    },
    {
      id: 'ra-mlu-2', code: 'RA2',
      description: 'Recepcion de elementos complementarios, relacionando sus caracteristicas con sus aplicaciones.',
      ces: [
        { id: 'ce-mlu-2a', code: 'a', description: 'Se ha identificado la composicion del lote recibido y sus medidas de proteccion.' },
        { id: 'ce-mlu-2b', code: 'b', description: 'Se ha verificado que los elementos recibidos coinciden con los solicitados.' },
        { id: 'ce-mlu-2c', code: 'c', description: 'Se han identificado distintos tipos de elementos complementarios.' },
        { id: 'ce-mlu-2d', code: 'd', description: 'Se han diferenciado los elementos complementarios segun sus caracteristicas y aplicaciones.' },
        { id: 'ce-mlu-2e', code: 'e', description: 'Se han clasificado utilizando la terminologia correcta.' },
      ],
    },
    {
      id: 'ra-mlu-3', code: 'RA3',
      description: 'Almacenamiento de materiales y productos textiles, justificando su ubicacion y condiciones.',
      ces: [
        { id: 'ce-mlu-3a', code: 'a', description: 'Se han agrupado los productos segun su origen y aplicacion.' },
        { id: 'ce-mlu-3b', code: 'b', description: 'Se han establecido las condiciones basicas de manipulacion y conservacion.' },
        { id: 'ce-mlu-3c', code: 'c', description: 'Se han identificado defectos derivados de una manipulacion o almacenamiento inadecuados.' },
        { id: 'ce-mlu-3d', code: 'd', description: 'Se han relacionado las condiciones ambientales con la integridad de los productos.' },
        { id: 'ce-mlu-3e', code: 'e', description: 'Se ha asegurado la trazabilidad de los productos en almacenamiento.' },
        { id: 'ce-mlu-3h', code: 'h', description: 'Se han aplicado medidas de seguridad y prevencion de riesgos en el almacen.' },
      ],
    },
    {
      id: 'ra-mlu-4', code: 'RA4',
      description: 'Control de existencias en el almacen, justificando el almacenaje minimo.',
      ces: [
        { id: 'ce-mlu-4a', code: 'a', description: 'Se ha realizado el inventario del almacen y elaborado partes de incidencia.' },
        { id: 'ce-mlu-4b', code: 'b', description: 'Se ha descrito la documentacion tecnica asociada al almacen.' },
        { id: 'ce-mlu-4c', code: 'c', description: 'Se ha relacionado el almacenaje minimo con el tiempo de aprovisionamiento.' },
        { id: 'ce-mlu-4f', code: 'f', description: 'Se han utilizado herramientas informaticas para el control del almacen.' },
        { id: 'ce-mlu-4g', code: 'g', description: 'Se han registrado las entradas y salidas de existencias.' },
      ],
    },
  ];

  for (const ra of mluRAs) {
    await prisma.learningOutcome.upsert({
      where: { id: ra.id },
      update: {},
      create: { id: ra.id, code: ra.code, description: ra.description, moduleId: 'mod-mlu' },
    });
    for (const ce of ra.ces) {
      await prisma.evaluationCriterion.upsert({
        where: { id: ce.id },
        update: {},
        create: { id: ce.id, code: ce.code, description: ce.description, learningOutcomeId: ra.id },
      });
    }
  }
  console.log('RA/CE modulo MLU cargados');

  // 10. USUARIOS
  await prisma.user.upsert({
    where: { email: 'dpto.madera@gmail.com' },
    update: { passwordHash, role: UserRole.JEFATURA },
    create: { id: 'user-jefatura', email: 'dpto.madera@gmail.com', passwordHash, firstName: 'Jefe', lastName: 'Departamento', role: UserRole.JEFATURA, centerId: center.id, updatedAt: new Date(), onboardingCompleted: true },
  });

  const profData = [
    { id: 'user-prof-cfgb1', email: 'profe.1cfgb@fpdoc.es', lastName: '1 CFGB' },
    { id: 'user-prof-cfgb2', email: 'profe.2cfgb@fpdoc.es', lastName: '2 CFGB' },
    { id: 'user-prof-cfgm1', email: 'profe.1cfgm@fpdoc.es', lastName: '1 CFGM' },
    { id: 'user-prof-cfgm2', email: 'profe.2cfgm@fpdoc.es', lastName: '2 CFGM' },
    { id: 'user-prof-cfgs1', email: 'profe.1cfgs@fpdoc.es', lastName: '1 CFGS' },
    { id: 'user-prof-cfgs2', email: 'profe.2cfgs@fpdoc.es', lastName: '2 CFGS' },
  ];
  for (const p of profData) {
    await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { id: p.id, email: p.email, passwordHash, firstName: 'Profesor', lastName: p.lastName, role: UserRole.PROFESOR, centerId: center.id, updatedAt: new Date() },
    });
  }
  console.log('Usuarios creados');

  // 11. ASIGNACIONES DOCENTES
  const assignments = [
    { teacherId: 'user-prof-cfgb1', moduleId: 'mod-opz', groupId: groups.cfgb1.id },
    { teacherId: 'user-prof-cfgb1', moduleId: 'mod-tpz', groupId: groups.cfgb1.id },
    { teacherId: 'user-prof-cfgb1', moduleId: 'mod-mlu', groupId: groups.cfgb1.id },
    { teacherId: 'user-prof-cfgb2', moduleId: 'mod-abd', groupId: groups.cfgb2.id },
    { teacherId: 'user-prof-cfgb2', moduleId: 'mod-ilb', groupId: groups.cfgb2.id },
    { teacherId: 'user-prof-cfgb2', moduleId: 'mod-nci', groupId: groups.cfgb2.id },
    { teacherId: 'user-prof-cfgm1', moduleId: 'mod-mrn', groupId: groups.cfgm1.id },
    { teacherId: 'user-prof-cfgm1', moduleId: 'mod-oaa', groupId: groups.cfgm1.id },
    { teacherId: 'user-prof-cfgm1', moduleId: 'mod-opp', groupId: groups.cfgm1.id },
    { teacherId: 'user-prof-cfgm1', moduleId: 'mod-sov', groupId: groups.cfgm1.id },
    { teacherId: 'user-prof-cfgm2', moduleId: 'mod-mcr', groupId: groups.cfgm2.id },
    { teacherId: 'user-prof-cfgm2', moduleId: 'mod-mjc', groupId: groups.cfgm2.id },
    { teacherId: 'user-prof-cfgm2', moduleId: 'mod-aad', groupId: groups.cfgm2.id },
    { teacherId: 'user-prof-cfgs1', moduleId: 'mod-drp', groupId: groups.cfgs1.id },
    { teacherId: 'user-prof-cfgs1', moduleId: 'mod-fat', groupId: groups.cfgs1.id },
    { teacherId: 'user-prof-cfgs1', moduleId: 'mod-pmb', groupId: groups.cfgs1.id },
    { teacherId: 'user-prof-cfgs1', moduleId: 'mod-rrc', groupId: groups.cfgs1.id },
    { teacherId: 'user-prof-cfgs2', moduleId: 'mod-ddr', groupId: groups.cfgs2.id },
    { teacherId: 'user-prof-cfgs2', moduleId: 'mod-gne', groupId: groups.cfgs2.id },
    { teacherId: 'user-prof-cfgs2', moduleId: 'mod-iyo', groupId: groups.cfgs2.id },
    { teacherId: 'user-prof-cfgs2', moduleId: 'mod-atz', groupId: groups.cfgs2.id },
  ];

  for (const a of assignments) {
    await prisma.teachingAssignment.upsert({
      where: { academicYearId_teacherId_moduleId_groupId: {
        academicYearId: academicYear.id,
        teacherId: a.teacherId,
        moduleId: a.moduleId,
        groupId: a.groupId,
      }},
      update: {},
      create: { academicYearId: academicYear.id, ...a },
    });
  }
  console.log('Asignaciones docentes creadas');

  // 12. TRIMESTRES
  const trimestres = [
    { id: 'trim-1', number: 1, startDate: new Date('2025-09-15'), endDate: new Date('2025-12-12'), evaluationSessionDate: new Date('2025-12-19') },
    { id: 'trim-2', number: 2, startDate: new Date('2025-12-15'), endDate: new Date('2026-03-13'), evaluationSessionDate: new Date('2026-03-20') },
    { id: 'trim-3', number: 3, startDate: new Date('2026-03-16'), endDate: new Date('2026-06-20'), evaluationSessionDate: new Date('2026-06-25') },
  ];
  for (const t of trimestres) {
    await prisma.trimester.upsert({
      where: { academicYearId_number: { academicYearId: academicYear.id, number: t.number } },
      update: {},
      create: { ...t, academicYearId: academicYear.id },
    });
  }
  console.log('Trimestres creados');

  // 13. MAQUINARIA Y SEGURIDAD
  const safety = [
    { id: 'sr-escuadradora', name: 'Escuadradora', toolLevel: 'TALLER' as const, epiRequired: 'Gafas, auriculares, guantes anticorte', trainingReq: 'Formacion especifica obligatoria' },
    { id: 'sr-sierra-banda',  name: 'Sierra de cinta',     toolLevel: 'TALLER'   as const, epiRequired: 'Gafas, auriculares, guantes',            trainingReq: 'Formacion especifica obligatoria' },
    { id: 'sr-tupi',          name: 'Tupi (fresadora)',     toolLevel: 'TALLER'   as const, epiRequired: 'Gafas, auriculares, calzado seguridad',  trainingReq: 'Formacion especifica obligatoria' },
    { id: 'sr-regruesadora',  name: 'Regruesadora',        toolLevel: 'TALLER'   as const, epiRequired: 'Gafas, auriculares',                     trainingReq: 'Formacion especifica obligatoria' },
    { id: 'sr-cepilladora',   name: 'Cepilladora',         toolLevel: 'TALLER'   as const, epiRequired: 'Gafas, auriculares',                     trainingReq: 'Formacion especifica obligatoria' },
    { id: 'sr-taladro',       name: 'Taladro de columna',  toolLevel: 'TALLER'   as const, epiRequired: 'Gafas, guantes',                         trainingReq: 'Instruccion basica' },
    { id: 'sr-prensa',        name: 'Prensa de montaje',   toolLevel: 'TALLER'   as const, epiRequired: 'Guantes, gafas',                         trainingReq: 'Instruccion basica' },
    { id: 'sr-pistola-aire',  name: 'Pistola de aire',     toolLevel: 'PORTATIL' as const, epiRequired: 'Gafas, mascarilla FFP2',                 trainingReq: 'Instruccion basica' },
    { id: 'sr-lijadora-orb',  name: 'Lijadora orbital',    toolLevel: 'PORTATIL' as const, epiRequired: 'Mascarilla, gafas',                      trainingReq: 'Ninguna especifica' },
    { id: 'sr-grapadora',     name: 'Grapadora neumatica', toolLevel: 'PORTATIL' as const, epiRequired: 'Gafas, guantes',                         trainingReq: 'Instruccion basica' },
  ];
  for (const s of safety) {
    await prisma.safetyRequirement.upsert({ where: { id: s.id }, update: {}, create: s });
  }
  console.log('Maquinaria y seguridad creadas');

  console.log('\nSeed completado.');
  console.log('AVISO: Los RA/CE de los demas modulos se importaran desde los PDFs del departamento.');
  console.log('AVISO: Los profesores placeholder se actualizan desde el panel de jefatura.');
  console.log('AVISO: Cuenta jefatura dpto.madera@gmail.com / password123 — cambiar en produccion.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
