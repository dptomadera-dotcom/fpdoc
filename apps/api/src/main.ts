import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPaths = [
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(process.cwd(), '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Cargando variables de entorno desde: ${envPath}`);
    dotenv.config({ path: envPath });
    break;
  }
}

console.log('DATABASE_URL cargada:', process.env.DATABASE_URL ? 'SÍ' : 'NO');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global de DTOs (necesario para @IsEmail, @IsEnum, @MinLength, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // CORS: permite localhost en cualquier puerto de dev + URL de producción
  const allowedOrigins: string[] = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'https://dptomadera-dotcom.github.io',
  ];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
  console.log(`API corriendo en http://localhost:${process.env.PORT ?? 4000}`);
}
bootstrap();
