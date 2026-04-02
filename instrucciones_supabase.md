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


---

### 5. Configurar Autenticación Social (Google/GitHub)
Para que los botones de "Login con Google/GitHub" funcionen, debes habilitarlos:
1. Ve a **Authentication > Providers** en Supabase.
2. Selecciona **Google** y actívalo (**Enabled**).
   - Necesitarás un `Client ID` y `Client Secret` de la [Google Cloud Console](https://console.cloud.google.com/).
3. Selecciona **GitHub** y actívalo.
   - Necesitarás un `Client ID` y `Client Secret` de un [GitHub OAuth App](https://github.com/settings/developers).

### 6. Configurar URLs de Redirección (MUY IMPORTANTE)
Como el frontend está en GitHub Pages, debes permitir que Supabase regrese a tu URL:
1. Ve a **Authentication > URL Configuration**.
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


---

### 5. Configurar Autenticación Social (Google/GitHub)
Para que los botones de "Login con Google/GitHub" funcionen, debes habilitarlos:
1. Ve a **Authentication > Providers** en Supabase.
2. Selecciona **Google** y actívalo (**Enabled**).
   - Necesitarás un `Client ID` y `Client Secret` de la [Google Cloud Console](https://console.cloud.google.com/).
3. Selecciona **GitHub** y actívalo.
   - Necesitarás un `Client ID` y `Client Secret` de un [GitHub OAuth App](https://github.com/settings/developers).

### 6. Configurar URLs de Redirección (MUY IMPORTANTE)
Como el frontend está en GitHub Pages, debes permitir que Supabase regrese a tu URL:
1. Ve a **Authentication > URL Configuration**.
2. En **Site URL**, pon: `https://dptomadera-dotcom.github.io/TRANSVERSAL-FP/`
3. En **Redirect URLs**, añade:
   - `https://dptomadera-dotcom.github.io/TRANSVERSAL-FP/login/`
   - `https://dptomadera-dotcom.github.io/TRANSVERSAL-FP/register/`
4. Guarda los cambios.

**Estado de la PWA:**
- Tu aplicación frontend ya está configurada para ser instalada en móviles (PWA).
- Una vez conectada la base de datos, los registros que crees desde la PWA se guardarán en la nube.
