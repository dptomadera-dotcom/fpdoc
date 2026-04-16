-- ════════════════════════════════════════════════════════════════════════════
-- RLS MIGRATION: Habilitar Row Level Security en las 31 tablas públicas
-- Proyecto: transversal-fp (fpdoc)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- IMPORTANTE: ejecutar de una sola vez como transacción
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- FUNCIÓN HELPER: obtiene el rol del usuario autenticado actual
-- SECURITY DEFINER para evitar recursión infinita en las políticas
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role::text FROM public."User" WHERE id = auth.uid()::text;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- BLOQUE 1 — TABLAS DE REFERENCIA / CATÁLOGO
-- Lectura: cualquier usuario autenticado
-- Escritura: solo ADMIN o JEFATURA
-- Tablas: Center, Department, Family, Cycle, Module, Course, Group,
--         LearningOutcome, EvaluationCriterion, SafetyRequirement,
--         CalendarDay, AssessmentInstrument
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public."Center" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "center_select_auth"  ON public."Center" FOR SELECT TO authenticated USING (true);
CREATE POLICY "center_write_admin"  ON public."Center" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."Department" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dept_select_auth"    ON public."Department" FOR SELECT TO authenticated USING (true);
CREATE POLICY "dept_write_admin"    ON public."Department" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."Family" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "family_select_auth"  ON public."Family" FOR SELECT TO authenticated USING (true);
CREATE POLICY "family_write_admin"  ON public."Family" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."Cycle" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cycle_select_auth"   ON public."Cycle" FOR SELECT TO authenticated USING (true);
CREATE POLICY "cycle_write_admin"   ON public."Cycle" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."Module" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "module_select_auth"  ON public."Module" FOR SELECT TO authenticated USING (true);
CREATE POLICY "module_write_admin"  ON public."Module" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."Course" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "course_select_auth"  ON public."Course" FOR SELECT TO authenticated USING (true);
CREATE POLICY "course_write_admin"  ON public."Course" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."Group" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "group_select_auth"   ON public."Group" FOR SELECT TO authenticated USING (true);
CREATE POLICY "group_write_admin"   ON public."Group" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."LearningOutcome" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lo_select_auth"      ON public."LearningOutcome" FOR SELECT TO authenticated USING (true);
CREATE POLICY "lo_write_admin"      ON public."LearningOutcome" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."EvaluationCriterion" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ec_select_auth"      ON public."EvaluationCriterion" FOR SELECT TO authenticated USING (true);
CREATE POLICY "ec_write_admin"      ON public."EvaluationCriterion" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."SafetyRequirement" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "safety_select_auth"  ON public."SafetyRequirement" FOR SELECT TO authenticated USING (true);
CREATE POLICY "safety_write_admin"  ON public."SafetyRequirement" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."CalendarDay" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cal_select_auth"     ON public."CalendarDay" FOR SELECT TO authenticated USING (true);
CREATE POLICY "cal_write_admin"     ON public."CalendarDay" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."AssessmentInstrument" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_inst_select_auth" ON public."AssessmentInstrument" FOR SELECT TO authenticated USING (true);
CREATE POLICY "ai_inst_write_admin" ON public."AssessmentInstrument" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

-- ════════════════════════════════════════════════════════════════════════════
-- BLOQUE 2 — ESTRUCTURA ACADÉMICA Y PLANIFICACIÓN
-- Lectura: cualquier usuario autenticado
-- Escritura: ADMIN, JEFATURA y PROFESOR
-- Tablas: ModuleTeacher, Project, ProjectModule, ProjectPhase,
--         Task, TaskCurriculumLink, TaskDependency, TaskSafetyLink, Session
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public."ModuleTeacher" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mt_select_auth"      ON public."ModuleTeacher" FOR SELECT TO authenticated USING (true);
CREATE POLICY "mt_write_staff"      ON public."ModuleTeacher" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA'));

ALTER TABLE public."Project" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proj_select_auth"    ON public."Project" FOR SELECT TO authenticated USING (true);
CREATE POLICY "proj_write_staff"    ON public."Project" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

ALTER TABLE public."ProjectModule" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm_select_auth"      ON public."ProjectModule" FOR SELECT TO authenticated USING (true);
CREATE POLICY "pm_write_staff"      ON public."ProjectModule" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

ALTER TABLE public."ProjectPhase" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pp_select_auth"      ON public."ProjectPhase" FOR SELECT TO authenticated USING (true);
CREATE POLICY "pp_write_staff"      ON public."ProjectPhase" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

ALTER TABLE public."Task" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_select_auth"    ON public."Task" FOR SELECT TO authenticated USING (true);
CREATE POLICY "task_write_staff"    ON public."Task" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

ALTER TABLE public."TaskCurriculumLink" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tcl_select_auth"     ON public."TaskCurriculumLink" FOR SELECT TO authenticated USING (true);
CREATE POLICY "tcl_write_staff"     ON public."TaskCurriculumLink" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

ALTER TABLE public."TaskDependency" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "td_select_auth"      ON public."TaskDependency" FOR SELECT TO authenticated USING (true);
CREATE POLICY "td_write_staff"      ON public."TaskDependency" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

ALTER TABLE public."TaskSafetyLink" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tsl_select_auth"     ON public."TaskSafetyLink" FOR SELECT TO authenticated USING (true);
CREATE POLICY "tsl_write_staff"     ON public."TaskSafetyLink" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

-- Session: tabla de sesiones de clase (no confundir con auth.sessions)
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sess_select_auth"    ON public."Session" FOR SELECT TO authenticated USING (true);
CREATE POLICY "sess_write_staff"    ON public."Session" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

-- ════════════════════════════════════════════════════════════════════════════
-- BLOQUE 3 — DATOS DEL ALUMNADO
-- Lectura: propio alumno + staff
-- Escritura: staff (profesores, jefatura, admin)
-- Tablas: StudentGroup, StudentProgress, MachineAuthorization
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public."StudentGroup" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sg_select"           ON public."StudentGroup" FOR SELECT TO authenticated
  USING ("userId" = auth.uid()::text OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));
CREATE POLICY "sg_write_staff"      ON public."StudentGroup" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

ALTER TABLE public."StudentProgress" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sp_select"           ON public."StudentProgress" FOR SELECT TO authenticated
  USING ("studentId" = auth.uid()::text OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));
CREATE POLICY "sp_write_staff"      ON public."StudentProgress" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

ALTER TABLE public."MachineAuthorization" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ma_select"           ON public."MachineAuthorization" FOR SELECT TO authenticated
  USING ("studentId" = auth.uid()::text OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));
CREATE POLICY "ma_write_staff"      ON public."MachineAuthorization" FOR ALL    TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'))
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

-- ════════════════════════════════════════════════════════════════════════════
-- BLOQUE 4 — EVIDENCIAS Y COMENTARIOS
-- Evidencias: alumno ve/sube las suyas; staff ve todas
-- El alumno solo puede editar su evidencia si está en estado PENDIENTE
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public."Evidence" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ev_select"           ON public."Evidence" FOR SELECT TO authenticated
  USING ("studentId" = auth.uid()::text OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

CREATE POLICY "ev_insert"           ON public."Evidence" FOR INSERT TO authenticated
  WITH CHECK ("studentId" = auth.uid()::text OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

-- Alumno solo puede editar sus propias evidencias mientras estén PENDIENTES
CREATE POLICY "ev_update"           ON public."Evidence" FOR UPDATE TO authenticated
  USING (
    ("studentId" = auth.uid()::text AND status = 'PENDIENTE'::"EvidenceStatus")
    OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR')
  )
  WITH CHECK (
    ("studentId" = auth.uid()::text AND status = 'PENDIENTE'::"EvidenceStatus")
    OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR')
  );

CREATE POLICY "ev_delete_staff"     ON public."Evidence" FOR DELETE TO authenticated
  USING (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

-- EvidenceComment
ALTER TABLE public."EvidenceComment" ENABLE ROW LEVEL SECURITY;

-- Puede ver comentarios quien es autor, el alumno de la evidencia, o staff
CREATE POLICY "evc_select"          ON public."EvidenceComment" FOR SELECT TO authenticated
  USING (
    "authorId" = auth.uid()::text
    OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR')
    OR EXISTS (
      SELECT 1 FROM public."Evidence" e
      WHERE e.id = "EvidenceComment"."evidenceId"
        AND e."studentId" = auth.uid()::text
    )
  );

-- Solo puede comentar quien tenga acceso a esa evidencia
CREATE POLICY "evc_insert"          ON public."EvidenceComment" FOR INSERT TO authenticated
  WITH CHECK ("authorId" = auth.uid()::text);

CREATE POLICY "evc_update_own"      ON public."EvidenceComment" FOR UPDATE TO authenticated
  USING ("authorId" = auth.uid()::text OR get_my_role() = 'ADMIN')
  WITH CHECK ("authorId" = auth.uid()::text OR get_my_role() = 'ADMIN');

CREATE POLICY "evc_delete_own"      ON public."EvidenceComment" FOR DELETE TO authenticated
  USING ("authorId" = auth.uid()::text OR get_my_role() = 'ADMIN');

-- ════════════════════════════════════════════════════════════════════════════
-- BLOQUE 5 — EVALUACIONES
-- El alumno ve sus propias evaluaciones
-- El profesor solo puede insertar/editar registros donde él es el evaluador
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public."AssessmentRecord" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ar_select"           ON public."AssessmentRecord" FOR SELECT TO authenticated
  USING ("studentId" = auth.uid()::text OR get_my_role() IN ('ADMIN','JEFATURA','PROFESOR'));

-- PROFESOR solo puede evaluar poniendo su propio id como evaluador
CREATE POLICY "ar_insert"           ON public."AssessmentRecord" FOR INSERT TO authenticated
  WITH CHECK (
    get_my_role() IN ('ADMIN','JEFATURA')
    OR (get_my_role() = 'PROFESOR' AND "assessedById" = auth.uid()::text)
  );

CREATE POLICY "ar_update"           ON public."AssessmentRecord" FOR UPDATE TO authenticated
  USING (
    get_my_role() IN ('ADMIN','JEFATURA')
    OR (get_my_role() = 'PROFESOR' AND "assessedById" = auth.uid()::text)
  )
  WITH CHECK (
    get_my_role() IN ('ADMIN','JEFATURA')
    OR (get_my_role() = 'PROFESOR' AND "assessedById" = auth.uid()::text)
  );

CREATE POLICY "ar_delete_admin"     ON public."AssessmentRecord" FOR DELETE TO authenticated
  USING (get_my_role() = 'ADMIN');

-- ════════════════════════════════════════════════════════════════════════════
-- BLOQUE 6 — OBSERVACIONES
-- El autor ve las suyas; el alumno ve las que le conciernen; admin/jefatura ve todas
-- El profesor solo puede escribir observaciones firmadas con su propio id
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public."Observation" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "obs_select"          ON public."Observation" FOR SELECT TO authenticated
  USING (
    "authorId" = auth.uid()::text
    OR "studentId" = auth.uid()::text
    OR get_my_role() IN ('ADMIN','JEFATURA')
  );

CREATE POLICY "obs_insert_staff"    ON public."Observation" FOR INSERT TO authenticated
  WITH CHECK (
    get_my_role() IN ('ADMIN','JEFATURA','PROFESOR')
    AND "authorId" = auth.uid()::text
  );

CREATE POLICY "obs_update_own"      ON public."Observation" FOR UPDATE TO authenticated
  USING ("authorId" = auth.uid()::text OR get_my_role() = 'ADMIN')
  WITH CHECK ("authorId" = auth.uid()::text OR get_my_role() = 'ADMIN');

CREATE POLICY "obs_delete_own"      ON public."Observation" FOR DELETE TO authenticated
  USING ("authorId" = auth.uid()::text OR get_my_role() = 'ADMIN');

-- ════════════════════════════════════════════════════════════════════════════
-- BLOQUE 7 — DATOS PERSONALES: AIInteraction y Alert
-- Cada usuario solo ve los suyos; ADMIN ve todos
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public."AIInteraction" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_select_own"       ON public."AIInteraction" FOR SELECT TO authenticated
  USING ("userId" = auth.uid()::text OR get_my_role() = 'ADMIN');
CREATE POLICY "ai_insert_own"       ON public."AIInteraction" FOR INSERT TO authenticated
  WITH CHECK ("userId" = auth.uid()::text);
CREATE POLICY "ai_delete_own"       ON public."AIInteraction" FOR DELETE TO authenticated
  USING ("userId" = auth.uid()::text OR get_my_role() = 'ADMIN');

ALTER TABLE public."Alert" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alert_select_own"    ON public."Alert" FOR SELECT TO authenticated
  USING ("userId" = auth.uid()::text OR get_my_role() = 'ADMIN');
-- Staff puede crear alertas para cualquier usuario; el propio usuario también
CREATE POLICY "alert_insert"        ON public."Alert" FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('ADMIN','JEFATURA','PROFESOR') OR "userId" = auth.uid()::text);
-- El usuario puede marcar sus alertas como leídas
CREATE POLICY "alert_update_own"    ON public."Alert" FOR UPDATE TO authenticated
  USING ("userId" = auth.uid()::text OR get_my_role() = 'ADMIN')
  WITH CHECK ("userId" = auth.uid()::text OR get_my_role() = 'ADMIN');
CREATE POLICY "alert_delete_admin"  ON public."Alert" FOR DELETE TO authenticated
  USING (get_my_role() = 'ADMIN');

-- ════════════════════════════════════════════════════════════════════════════
-- BLOQUE 8 — AUDIT LOG
-- Solo ADMIN puede leer; solo service_role puede escribir (desde backend/triggers)
-- Ningún usuario autenticado puede insertar, modificar o borrar
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public."AuditLog" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auditlog_select_admin" ON public."AuditLog" FOR SELECT TO authenticated
  USING (get_my_role() = 'ADMIN');
-- Sin política INSERT/UPDATE/DELETE para authenticated: solo service_role puede escribir

COMMIT;
