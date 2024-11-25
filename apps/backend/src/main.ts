import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { typeOrmExceptionFilter } from './filter/\btypeorm.exception.filter';
import { httpExceptionFilter } from './filter/http.exception.filter';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new typeOrmExceptionFilter());
  app.useGlobalFilters(new httpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*', // 필요에 따라 특정 도메인만 허용
    allowedHeaders: 'Authorization, Content-Type' // Authorization 헤더를 허용
  });

  const config = new DocumentBuilder()
    .setTitle('Froxy swagger')
    .setDescription('Froxy API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true // 인증 정보 자동 저장
    }
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, customOptions);

  await app.listen(3000);
}
bootstrap();
