import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import * as express from 'express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from '@libs/configs';

async function bootstrap() {
  const PORT = parseInt(String(env.port), 10) || 2005;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', `http://localhost:${PORT}`],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PATCH,PUT',
  });

  app.use(morgan('tiny'));
  app.use(express.json({ limit: 5 << 20 }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Memegoat Game')
    .setVersion('1.7.2')
    .addServer(`http://localhost:${PORT}`, 'Local')
    .addBearerAuth()
    .addCookieAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, swaggerDocument);

  try {
    await app.listen(PORT);
    console.info(`http://localhost:${PORT}`);
  } catch (err) {
    console.error(err.message);
  }
}

void bootstrap();
