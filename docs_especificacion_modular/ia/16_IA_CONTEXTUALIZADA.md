# 16 — IA contextualizada

## Principio general

La IA no es la base del sistema, sino una capa posterior de apoyo. El aplicativo debe funcionar completamente sin IA. La inteligencia artificial añade valor como asistente, no como motor de decisiones.

## IA para el alumnado

### Debe poder
- Explicar qué pide una tarea concreta en lenguaje sencillo.
- Resumir los pasos necesarios para completar una tarea.
- Recordar qué entregables faltan y cuáles son las fechas límite.
- Orientar sobre documentación técnica asociada al proyecto (fichas de materiales, planos).
- Dar apoyo teórico contextual (ej: "¿qué es una unión a caja y espiga?").

### No debe
- Sustituir la evaluación docente.
- Dar instrucciones de uso de maquinaria (riesgo de seguridad).
- Inventar estados académicos o notas.
- Proporcionar respuestas a evaluaciones o ejercicios calificables.

## IA para el profesorado

### Debe poder
- Resumir el progreso de un alumno o grupo.
- Sugerir vinculación entre tareas y RA/CE basándose en la descripción de la tarea.
- Proponer textos de observaciones de seguimiento.
- Detectar huecos en la cobertura curricular de un proyecto.
- Alertar sobre patrones de retraso o bajo rendimiento.

### No debe
- Emitir decisiones automáticas finales de evaluación sin validación humana.
- Modificar datos de evaluación directamente.

## Requisitos técnicos

### Contexto controlado
Cada llamada a la IA debe incluir un contexto estructurado, no un prompt genérico. Ejemplo para consulta de alumno:

```json
{
  "role": "ALUMNO",
  "studentId": "...",
  "projectName": "Taburete de taller",
  "currentPhase": "Fase 2: Preparación",
  "currentTask": {
    "title": "Corte de piezas con serrucho",
    "description": "...",
    "linkedRA": ["RA2: Opera con herramientas manuales"],
    "linkedCE": ["CE2a", "CE2b"],
    "status": "EN_CURSO",
    "dueDate": "2025-11-20"
  },
  "pendingEvidences": 1,
  "overallProgress": 45
}
```

### Registro y trazabilidad
Toda interacción con la IA se almacena en `AIInteraction`:
- Prompt enviado.
- Respuesta recibida.
- Contexto que se envió al modelo (como JSON).
- Usuario y rol.
- Modelo/proveedor utilizado.
- Timestamp.

### Filtros de seguridad

El sistema prompt del agente IA debe incluir restricciones explícitas:

```
Eres un asistente educativo para Formación Profesional.

REGLAS ESTRICTAS:
- NUNCA des instrucciones sobre el uso de maquinaria de taller.
- NUNCA inventes datos académicos (notas, estados, fechas) que no estén en el contexto.
- Si no tienes información suficiente, di que el alumno debe consultar con su profesor.
- Responde siempre en español.
- No respondas a preguntas que no estén relacionadas con el proyecto o las tareas del alumno.
```

### Proveedor intercambiable
La integración debe permitir cambiar de proveedor (OpenAI, Anthropic, modelo local) sin modificar la lógica de negocio. Implementar como servicio abstracto:

```typescript
interface AIService {
  query(context: AIContext, prompt: string): Promise<AIResponse>;
}
```

Con implementaciones concretas (`OpenAIService`, `AnthropicService`, `LocalModelService`) inyectables por configuración.

### Límites de uso
- Rate limiting por usuario y rol.
- Los alumnos tienen un límite diario de consultas (configurable).
- Los profesores pueden tener límites más amplios.
- El admin puede ajustar estos límites desde configuración.

## Dato pendiente

> ¿Qué proveedor de IA se usará? ¿Hay presupuesto para API de terceros (OpenAI, Anthropic) o se prefiere modelo local (Ollama, etc.)? ¿El alumnado usará la IA desde el inicio o solo el profesorado?
