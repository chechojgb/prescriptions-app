import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://prescriptions-app-production-aa8c.up.railway.app/'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));


  const config = new DocumentBuilder()
    .setTitle('Prescriptions API')
    .setDescription('API for system to prescription medical')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  
  try {
    await app.listen(port, '0.0.0.0');
    logger.log(`application is running on: http://0.0.0.0:${port}`);
    logger.log(`Documentación disponible en: http://0.0.0.0:${port}/docs`);
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
  }
}

bootstrap();