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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean) as string[],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
  console.log(`API corriendo en http://localhost:${process.env.PORT ?? 4000}`);
}
bootstrap();
