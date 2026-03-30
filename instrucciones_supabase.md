# Guía de Conexión: TRANSVERSAL FP ↔️ Supabase

Para que el sistema sea funcional y persistente, debemos vincular el backend con tu base de datos de Supabase.

### 1. Obtener la cadena de conexión
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard/projects).
2. Entra en tu proyecto **TRANSVERSAL FP**.
3. Haz clic en el icono de **Settings** (engranaje) abajo a la izquierda.
4. Selecciona **Database**.
5. Busca la sección **Connection string**. Asegúrate de que el modo sea **Transaction** (usualmente usa el puerto `6543`).
6. Copia el contenido. Se verá algo como:
   `postgresql://postgres.xxx:[TU_CONTRASEÑA]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

### 2. Configurar el archivo `.env`
1. Abre el archivo `backend/.env` en VS Code.
2. Reemplaza el valor de `DATABASE_URL` por la cadena que copiaste:
   ```env
   DATABASE_URL="postgresql://postgres.xxx:TU_CLAVE@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
   *Nota: Recuerda sustituir `[TU_CONTRASEÑA]` por la contraseña que elegiste al crear el proyecto.*

### 3. Sincronizar la Base de Datos
Una vez guardado el archivo `.env`, abre la terminal en la carpeta `backend` y ejecuta:
```bash
npx prisma db push
```
Esto creará todas las tablas necesarias (Proyectos, Tareas, RA, CE, etc.) en tu base de datos de Supabase.

### 4. Iniciar el Backend
Desde la carpeta `backend`, ejecuta:
```bash
npm run start:dev
```

---

**Estado de la PWA:**
- Tu aplicación frontend ya está configurada para ser instalada en móviles (PWA).
- Una vez conectada la base de datos, los registros que crees desde la PWA se guardarán en la nube.
