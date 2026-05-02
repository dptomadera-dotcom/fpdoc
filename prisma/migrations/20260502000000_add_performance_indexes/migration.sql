-- Performance indexes for models added after baseline

CREATE INDEX IF NOT EXISTS "CCPAgendaItem_meetingId_idx" ON "CCPAgendaItem"("meetingId");
CREATE INDEX IF NOT EXISTS "InternshipAgreement_companyId_idx" ON "InternshipAgreement"("companyId");
CREATE INDEX IF NOT EXISTS "InternshipAgreement_groupId_academicYearId_idx" ON "InternshipAgreement"("groupId", "academicYearId");
CREATE INDEX IF NOT EXISTS "InternshipLog_agreementId_date_idx" ON "InternshipLog"("agreementId", "date");
CREATE INDEX IF NOT EXISTS "IntermodularProject_groupId_academicYearId_idx" ON "IntermodularProject"("groupId", "academicYearId");
CREATE INDEX IF NOT EXISTS "IntermodularProjectSection_projectId_idx" ON "IntermodularProjectSection"("projectId");
CREATE INDEX IF NOT EXISTS "ProjectCurriculumMapping_projectId_idx" ON "ProjectCurriculumMapping"("projectId");
CREATE INDEX IF NOT EXISTS "ProjectCurriculumMapping_moduleId_idx" ON "ProjectCurriculumMapping"("moduleId");
CREATE INDEX IF NOT EXISTS "ProjectPhaseType_familyId_idx" ON "ProjectPhaseType"("familyId");
CREATE INDEX IF NOT EXISTS "Topic_moduleId_idx" ON "Topic"("moduleId");
CREATE INDEX IF NOT EXISTS "Topic_raId_idx" ON "Topic"("raId");
CREATE INDEX IF NOT EXISTS "Questionnaire_academicYearId_idx" ON "Questionnaire"("academicYearId");
CREATE INDEX IF NOT EXISTS "QuestionnaireResponse_questionnaireId_idx" ON "QuestionnaireResponse"("questionnaireId");
