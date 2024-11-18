import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Froxy swagger')
    .setDescription('Froxy API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true
    }
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, customOptions);
  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
