import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJson = require('../package.json') as { version: string };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // set up global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NestJS Exercise')
    .setDescription('A simple NestJS exercise API for testing purposes')
    .setVersion(packageJson.version)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `
     Server is running on port: http://localhost:${process.env.PORT ?? 3000}
     Swagger documentation available at: http://localhost:${process.env.PORT ?? 3000}/api
     Version: ${packageJson.version}
     `,
  );
}
void bootstrap();
