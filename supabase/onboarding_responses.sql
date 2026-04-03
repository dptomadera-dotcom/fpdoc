-- Tabla para almacenar respuestas del cuestionario inicial de cada usuario
-- Ejecutar en el SQL Editor de Supabase

create table if not exists public.onboarding_responses (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null check (role in ('ALUMNO', 'PROFESOR', 'JEFATURA', 'ADMIN')),
  answers      jsonb not null default '{}',
  completed_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (user_id)
);

-- RLS: cada usuario solo puede leer y escribir sus propias respuestas
alter table public.onboarding_responses enable row level security;

create policy "Usuario ve sus propias respuestas"
  on public.onboarding_responses for select
  using (auth.uid() = user_id);

create policy "Usuario inserta sus propias respuestas"
  on public.onboarding_responses for insert
  with check (auth.uid() = user_id);

create policy "Usuario actualiza sus propias respuestas"
  on public.onboarding_responses for update
  using (auth.uid() = user_id);

-- El jefe de departamento puede leer las respuestas de alumnado
-- La columna id en public."User" es text (generada por Prisma), por eso se castea auth.uid()
create policy "Jefe lee respuestas de alumnado"
  on public.onboarding_responses for select
  using (
    exists (
      select 1 from public."User"
      where id = auth.uid()::text and role = 'JEFATURA'
    )
    and role = 'ALUMNO'
  );
