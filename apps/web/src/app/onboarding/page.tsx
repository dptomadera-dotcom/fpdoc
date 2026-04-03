'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, BookOpen, ShieldCheck,
  ChevronRight, ChevronLeft, CheckCircle,
  Sparkles, Loader2, ArrowRight
} from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────
type FieldType = 'radio' | 'checkbox' | 'select' | 'textarea' | 'text' | 'scale';

interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  scaleMin?: string;
  scaleMax?: string;
  required?: boolean;
}

interface Step {
  title: string;
  subtitle: string;
  fields: Field[];
}

// ─── CUESTIONARIO ALUMNO ──────────────────────────────────────────────────────
const STEPS_ALUMNO: Step[] = [
  {
    title: 'Vía de acceso y estudios previos',
    subtitle: 'Cuéntanos cómo has llegado hasta aquí.',
    fields: [
      {
        key: 'via_acceso',
        label: '¿Por qué vía accedes al ciclo?',
        type: 'radio',
        options: ['ESO + prueba de acceso', 'Bachillerato', 'Ciclo de grado medio', 'Ciclo de grado superior', 'Prueba para mayores de 25 años', 'Experiencia laboral homologada'],
        required: true,
      },
      {
        key: 'estudios_previos',
        label: '¿Qué estudios previos tienes relacionados con esta familia profesional?',
        type: 'radio',
        options: ['Ninguno relacionado', 'Algún módulo suelto o curso', 'Ciclo formativo completo', 'Grado universitario relacionado', 'Otro'],
      },
      {
        key: 'experiencia_laboral',
        label: '¿Tienes experiencia laboral previa en el sector?',
        type: 'radio',
        options: ['No, ninguna', 'Sí, menos de 6 meses', 'Sí, entre 6 meses y 2 años', 'Sí, más de 2 años'],
        required: true,
      },
    ],
  },
  {
    title: 'Autopercepción y hábitos',
    subtitle: 'Queremos conocerte mejor para apoyarte desde el primer día.',
    fields: [
      {
        key: 'autopercepcion',
        label: '¿Cómo te defines como estudiante?',
        type: 'radio',
        options: ['Me cuesta organizarme pero me esfuerzo', 'Soy constante aunque a veces me bloqueo', 'Me adapto bien y aprendo rápido', 'Necesito más apoyo del que habitualmente se da', 'Prefiero la práctica a la teoría'],
      },
      {
        key: 'habitos_estudio',
        label: '¿Cómo sueles estudiar habitualmente?',
        type: 'checkbox',
        options: ['Solo/a en casa', 'En grupo con compañeros', 'En biblioteca o espacios compartidos', 'Con tutoriales en vídeo', 'Leyendo apuntes o manuales', 'Practicando directamente'],
      },
      {
        key: 'manejo_digital',
        label: '¿Cómo valorarías tu nivel de manejo digital?',
        type: 'scale',
        scaleMin: 'Básico',
        scaleMax: 'Avanzado',
        required: true,
      },
    ],
  },
  {
    title: 'Necesidades y expectativas',
    subtitle: 'Esta información es confidencial y solo se usa para mejorar tu itinerario.',
    fields: [
      {
        key: 'necesidades_apoyo',
        label: '¿Tienes alguna necesidad de apoyo específica?',
        type: 'checkbox',
        options: ['Dificultades de lectoescritura', 'Barrera idiomática', 'Necesidad de adaptación de tiempo', 'Dificultades de movilidad o accesibilidad', 'Situación personal o familiar compleja', 'No, ninguna específica'],
      },
      {
        key: 'motivacion',
        label: '¿Qué te motivó a elegir este ciclo?',
        type: 'radio',
        options: ['Salidas laborales', 'Vocación o interés personal', 'Continuación de estudios universitarios', 'Recomendación de alguien', 'Cambio de sector o reconversión profesional'],
        required: true,
      },
      {
        key: 'expectativas',
        label: '¿Qué esperas conseguir al terminar el ciclo?',
        type: 'textarea',
        placeholder: 'Describe brevemente tus expectativas personales y profesionales…',
      },
    ],
  },
];

// ─── CUESTIONARIO PROFESOR ─────────────────────────────────────────────────────
const STEPS_PROFESOR: Step[] = [
  {
    title: 'Módulos asignados',
    subtitle: 'Configura los módulos que impartirás este curso.',
    fields: [
      {
        key: 'modulos',
        label: '¿Qué módulos impartes este curso? (uno por línea)',
        type: 'textarea',
        placeholder: 'Ej.\nSistemas Informáticos (SI) — 1º CFGM\nBases de Datos (BD) — 1º CFGM',
        required: true,
      },
      {
        key: 'grupos',
        label: '¿A qué grupos les impartes clase?',
        type: 'checkbox',
        options: ['1º CFGM', '2º CFGM', '1º CFGS', '2º CFGS', 'Grupo mixto'],
        required: true,
      },
      {
        key: 'horas_semanales',
        label: '¿Cuántas horas semanales tienes de docencia directa?',
        type: 'radio',
        options: ['Menos de 10 h', 'Entre 10 y 15 h', 'Entre 15 y 20 h', 'Más de 20 h'],
      },
    ],
  },
  {
    title: 'Planificación curricular',
    subtitle: 'Información sobre cómo estructuras tus módulos.',
    fields: [
      {
        key: 'ra_importados',
        label: '¿Ya tienes definidos los Resultados de Aprendizaje (RA) de tus módulos?',
        type: 'radio',
        options: ['Sí, los tengo del año anterior', 'Sí, los he revisado y actualizado', 'Tengo el PDF normativo pero no los he volcado aún', 'No, los configuraré desde cero'],
        required: true,
      },
      {
        key: 'secuenciacion',
        label: '¿Tienes previsto trabajar por Unidades de Trabajo (UT)?',
        type: 'radio',
        options: ['Sí, ya tengo la secuenciación definida', 'Sí, pero la iré construyendo a lo largo del curso', 'Prefiero trabajar por bloques de contenido', 'Aún no lo he decidido'],
      },
      {
        key: 'instrumentos_evaluacion',
        label: '¿Qué instrumentos de evaluación usas habitualmente?',
        type: 'checkbox',
        options: ['Rúbricas de práctica', 'Prueba escrita o tipo test', 'Proyecto individual', 'Proyecto grupal', 'Portafolio o diario de aprendizaje', 'Observación directa', 'Defensa oral'],
        required: true,
      },
    ],
  },
  {
    title: 'Proyecto y recursos',
    subtitle: 'Colaboración interdepartamental y materiales disponibles.',
    fields: [
      {
        key: 'proyecto_intermodular',
        label: '¿Participas en algún proyecto intermodular este curso?',
        type: 'radio',
        options: ['Sí, ya está definido', 'Sí, estamos en proceso de diseño', 'No de momento', 'No lo sé aún'],
      },
      {
        key: 'materiales',
        label: '¿Con qué recursos y materiales trabajas principalmente?',
        type: 'checkbox',
        options: ['Libro de texto', 'Apuntes propios', 'Plataforma digital (Moodle, Classroom…)', 'Recursos web y videotutoriales', 'Equipamiento de taller', 'Software especializado'],
      },
      {
        key: 'tipos_evidencia',
        label: '¿Qué tipos de evidencias genera tu alumnado?',
        type: 'checkbox',
        options: ['Trabajos escritos', 'Proyectos técnicos o prácticas', 'Capturas o registros de proceso', 'Presentaciones', 'Código o archivos digitales', 'Memorias o informes'],
      },
      {
        key: 'observaciones_iniciales',
        label: '¿Hay algo más que quieras añadir sobre tu planificación inicial?',
        type: 'textarea',
        placeholder: 'Cualquier observación relevante sobre el curso que empieza…',
      },
    ],
  },
];

// ─── CUESTIONARIO JEFATURA ────────────────────────────────────────────────────────
const STEPS_JEFATURA: Step[] = [
  {
    title: 'Estructura del departamento',
    subtitle: 'Configura la base organizativa del ciclo para este curso.',
    fields: [
      {
        key: 'ciclo',
        label: '¿Qué ciclo(s) gestiona tu departamento?',
        type: 'textarea',
        placeholder: 'Ej.\nCFGM Sistemas Microinformáticos y Redes\nCFGS Administración de Sistemas Informáticos en Red',
        required: true,
      },
      {
        key: 'grupos',
        label: '¿Cuántos grupos tiene el departamento este curso?',
        type: 'radio',
        options: ['1 grupo', '2 grupos', '3 grupos', '4 o más grupos'],
        required: true,
      },
      {
        key: 'profesorado_asignado',
        label: '¿Cuántos docentes forman el departamento este curso?',
        type: 'radio',
        options: ['1 docente', '2-3 docentes', '4-5 docentes', 'Más de 5 docentes'],
        required: true,
      },
    ],
  },
  {
    title: 'Calendario y normativa',
    subtitle: 'Marco temporal y normativo del curso.',
    fields: [
      {
        key: 'inicio_curso',
        label: '¿Cuándo está previsto el inicio del curso lectivo?',
        type: 'radio',
        options: ['Septiembre 2026', 'Octubre 2026', 'Otro mes'],
      },
      {
        key: 'periodos_fct',
        label: '¿Cuándo están previstos los períodos de FCT/empresa?',
        type: 'checkbox',
        options: ['1er trimestre', '2º trimestre', '3er trimestre', 'Final de curso (mayo-junio)', 'No aplica en este ciclo'],
      },
      {
        key: 'normativa_referencia',
        label: '¿Qué normativa autonómica es la de referencia principal?',
        type: 'radio',
        options: ['Canarias', 'Andalucía', 'Madrid', 'Cataluña', 'País Vasco', 'Comunidad Valenciana', 'Castilla y León', 'Otra comunidad autónoma'],
        required: true,
      },
    ],
  },
  {
    title: 'Proyectos y coordinación',
    subtitle: 'Supervisión pedagógica y coherencia del ciclo.',
    fields: [
      {
        key: 'proyectos_aprobados',
        label: '¿El departamento tiene proyectos intermodulares aprobados para este curso?',
        type: 'radio',
        options: ['Sí, ya están definidos y asignados', 'Estamos en proceso de diseño', 'No de momento', 'El departamento no trabaja con proyectos intermodulares'],
        required: true,
      },
      {
        key: 'estructura_coordinacion',
        label: '¿Cómo se organiza la coordinación del departamento?',
        type: 'checkbox',
        options: ['Reuniones semanales de equipo', 'Reuniones quincenales', 'Reuniones mensuales', 'Coordinación informal entre docentes', 'Mediante plataforma digital', 'No hay reuniones formales establecidas'],
      },
      {
        key: 'prioridades_curso',
        label: '¿Cuáles son las prioridades pedagógicas de la jefatura para este curso?',
        type: 'textarea',
        placeholder: 'Describe las líneas de trabajo clave que quieres consolidar este año…',
      },
      {
        key: 'revision_coherencia',
        label: '¿Con qué frecuencia prevés revisar la coherencia global de las programaciones?',
        type: 'radio',
        options: ['Cada evaluación (trimestral)', 'Mensualmente', 'Al inicio y al final del curso', 'Solo cuando haya incidencias'],
      },
    ],
  },
];

// ─── META POR ROL ─────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<string, {
  steps: Step[];
  color: string;
  bg: string;
  border: string;
  Icon: any;
  label: string;
  intro: string;
  redirect: string;
}> = {
  ALUMNO: {
    steps: STEPS_ALUMNO,
    color: '#0d6e6e',
    bg: '#E1F5EE',
    border: '#0d6e6e30',
    Icon: GraduationCap,
    label: 'Alumnado',
    intro: 'Este cuestionario nos ayuda a conocerte desde el primer día y adaptar tu itinerario formativo. Solo son datos educativos, no invasivos. Se completa en 3 pasos.',
    redirect: typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/fpdoc/dashboard' : '/dashboard',
  },
  PROFESOR: {
    steps: STEPS_PROFESOR,
    color: '#7c3aed',
    bg: '#EEEDFE',
    border: '#7c3aed30',
    Icon: BookOpen,
    label: 'Profesorado',
    intro: 'Configura la información estructural de los módulos que impartirás. Con esto el sistema construye la base de tu programación didáctica desde el primer día.',
    redirect: typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/fpdoc/dashboard/programaciones' : '/dashboard/programaciones',
  },
  JEFATURA: {
    steps: STEPS_JEFATURA,
    color: '#b45309',
    bg: '#FAEEDA',
    border: '#b4530930',
    Icon: ShieldCheck,
    label: 'Jefe de Dpto.',
    intro: 'Define el marco organizativo del departamento para el curso. Esta configuración inicial permite que todo el equipo trabaje sobre una base común validada.',
    redirect: typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/fpdoc/dashboard' : '/dashboard',
  },
};

// ─── COMPONENTE CAMPO ─────────────────────────────────────────────────────────
function FieldInput({
  field,
  value,
  onChange,
  color,
}: {
  field: Field;
  value: any;
  onChange: (key: string, val: any) => void;
  color: string;
}) {
  if (field.type === 'radio') {
    return (
      <div className="space-y-2">
        {field.options!.map(opt => (
          <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${value === opt ? 'border-current bg-current/5' : 'border-[#f0eee8] hover:border-[#e0ddd6]'}`}
            style={value === opt ? { borderColor: color, background: `${color}10` } : {}}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all`}
              style={{ borderColor: value === opt ? color : '#d1cfc9' }}>
              {value === opt && <div className="w-2 h-2 rounded-full" style={{ background: color }} />}
            </div>
            <input type="radio" className="sr-only" checked={value === opt} onChange={() => onChange(field.key, opt)} />
            <span className="text-sm text-[var(--ink)]">{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === 'checkbox') {
    const selected: string[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {field.options!.map(opt => {
          const checked = selected.includes(opt);
          return (
            <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all`}
              style={checked ? { borderColor: color, background: `${color}10` } : { borderColor: '#f0eee8' }}>
              <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0`}
                style={{ borderColor: checked ? color : '#d1cfc9', background: checked ? color : 'transparent' }}>
                {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" className="sr-only" checked={checked}
                onChange={() => {
                  const next = checked ? selected.filter(s => s !== opt) : [...selected, opt];
                  onChange(field.key, next);
                }} />
              <span className="text-sm text-[var(--ink)]">{opt}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value || ''}
        onChange={e => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className="w-full bg-[var(--bg1)] border border-[#f0eee8] rounded-2xl px-4 py-3 text-sm text-[var(--ink)] placeholder-[var(--ink3)]/50 resize-none outline-none transition-all focus:border-current focus:bg-white"
        style={{ '--tw-ring-color': color } as any}
        onFocus={e => { e.target.style.borderColor = color; }}
        onBlur={e => { e.target.style.borderColor = ''; }}
      />
    );
  }

  if (field.type === 'scale') {
    const num = parseInt(value) || 0;
    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(field.key, String(n))}
              className="flex-1 h-12 rounded-xl border-2 font-bold text-sm transition-all"
              style={num === n
                ? { borderColor: color, background: color, color: 'white' }
                : { borderColor: '#f0eee8', color: 'var(--ink3)' }
              }
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--ink3)]">
          <span>{field.scaleMin}</span>
          <span>{field.scaleMax}</span>
        </div>
      </div>
    );
  }

  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className="w-full h-12 bg-[var(--bg1)] border border-[#f0eee8] rounded-2xl px-4 text-sm text-[var(--ink)] outline-none transition-all focus:bg-white"
      onFocus={e => { e.target.style.borderColor = color; }}
      onBlur={e => { e.target.style.borderColor = ''; }}
    />
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0); // 0 = intro, 1..N = pasos
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const u = authService.getCurrentUser();
    const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    if (!u) { router.push(isProd ? '/fpdoc/login' : '/login'); return; }
    setUser(u);
  }, [router]);

  if (!user) return null;

  const role = user.role || 'PROFESOR';
  const config = ROLE_CONFIG[role] || ROLE_CONFIG['PROFESOR'];
  const { steps, color, bg, border, Icon, label, intro, redirect } = config;
  const totalSteps = steps.length;
  const currentStep = steps[step - 1];

  const handleChange = (key: string, val: any) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const isStepValid = () => {
    if (!currentStep) return true;
    return currentStep.fields.every(f => {
      if (!f.required) return true;
      const v = answers[f.key];
      if (!v) return false;
      if (Array.isArray(v)) return v.length > 0;
      return String(v).trim().length > 0;
    });
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await supabase.from('onboarding_responses').upsert({
        user_id: user.id,
        role: role,
        answers: answers,
        completed_at: new Date().toISOString(),
      });
    } catch (_) {
      // Si la tabla no existe aún, continuar igualmente
    }
    setDone(true);
    setTimeout(() => router.push(redirect), 2000);
  };

  // ── Vista: COMPLETADO ──
  if (done) {
    return (
      <div className="min-h-screen bg-[var(--bg1)] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ background: bg, border: `2px solid ${color}` }}>
            <CheckCircle className="w-10 h-10" style={{ color }} />
          </div>
          <h2 className="text-3xl font-bold font-serif text-[var(--ink)] mb-2">¡Todo listo!</h2>
          <p className="text-sm text-[var(--ink3)] leading-relaxed">Tu perfil inicial está configurado. Accediendo a tu espacio de trabajo…</p>
          <div className="mt-6 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--ink3)]" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg1)] flex flex-col">
      {/* ── Header fijo ── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#f0eee8] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg, border: `1.5px solid ${color}30` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>Cuestionario inicial</p>
              <p className="text-xs font-bold text-[var(--ink)]">{label}</p>
            </div>
          </div>

          {step > 0 && (
            <div className="flex items-center gap-3">
              {/* Barra de progreso */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div key={i} className="h-1.5 rounded-full transition-all" style={{
                    width: i < step ? '24px' : '8px',
                    background: i < step ? color : '#f0eee8',
                  }} />
                ))}
              </div>
              <span className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest">{step}/{totalSteps}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Contenido ── */}
      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">

            {/* INTRO */}
            {step === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg" style={{ background: bg, border: `2px solid ${color}30` }}>
                  <Icon className="w-10 h-10" style={{ color }} />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[10px] font-black uppercase tracking-widest" style={{ background: bg, color, border: `1px solid ${color}30` }}>
                  <Sparkles className="w-3 h-3" />
                  Perfil inicial · {label}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-serif text-[var(--ink)] tracking-tight mb-4">
                  Bienvenido/a,<br /><span style={{ color }}>{user.firstName || user.email?.split('@')[0]}</span>
                </h1>

                <p className="text-base text-[var(--ink3)] leading-relaxed max-w-lg mx-auto mb-10">
                  {intro}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
                  {steps.map((s, i) => (
                    <div key={i} className="text-center p-4 bg-white rounded-2xl border border-[#f0eee8]">
                      <div className="text-2xl font-bold font-serif mb-1" style={{ color }}>{i + 1}</div>
                      <div className="text-[10px] font-bold text-[var(--ink3)] leading-tight">{s.title.split(' ').slice(0, 3).join(' ')}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="h-14 px-12 rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 mx-auto hover:scale-105 transition-all shadow-xl"
                  style={{ background: color, boxShadow: `0 20px 40px ${color}30` }}
                >
                  Comenzar cuestionario <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => router.push(redirect)}
                  className="mt-4 block text-center text-[11px] font-bold text-[var(--ink3)] hover:text-[var(--ink)] transition-colors mx-auto"
                >
                  Omitir por ahora →
                </button>
              </motion.div>
            )}

            {/* PASOS */}
            {step > 0 && currentStep && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {/* Título del paso */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>Paso {step} de {totalSteps}</span>
                  </div>
                  <h2 className="text-3xl font-bold font-serif text-[var(--ink)] tracking-tight">{currentStep.title}</h2>
                  <p className="text-sm text-[var(--ink3)] mt-1 leading-relaxed">{currentStep.subtitle}</p>
                </div>

                {/* Campos */}
                <div className="space-y-8">
                  {currentStep.fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-bold text-[var(--ink)] mb-3">
                        {field.label}
                        {field.required && <span className="ml-1 text-red-400">*</span>}
                      </label>
                      <FieldInput field={field} value={answers[field.key]} onChange={handleChange} color={color} />
                    </div>
                  ))}
                </div>

                {/* Navegación */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#f0eee8]">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#f0eee8] text-sm font-bold text-[var(--ink3)] hover:text-[var(--ink)] hover:border-[#d1cfc9] transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Atrás
                  </button>

                  {step < totalSteps ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40"
                      style={{ background: color }}
                    >
                      Siguiente <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      disabled={saving || !isStepValid()}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40"
                      style={{ background: color }}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Finalizar</>}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
