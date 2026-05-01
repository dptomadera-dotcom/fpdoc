FROM node:20.19.0-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Generar Prisma Client y compilar
RUN cd apps/api && pnpm run build

# Exponer puerto
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["node", "apps/api/dist/main"]
