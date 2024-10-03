import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors(),
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

  // Exponer la carpeta 'uploads' para que sea accesible
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Se accede a las imágenes desde '/uploads/nombre.jpg'
  });

  await app.listen(3000);
}
bootstrap();
