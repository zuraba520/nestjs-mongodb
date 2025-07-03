import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3003','http://localhost:3005'], 
  });
  

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
    new ValidateObjectIdPipe(),
  );

  await app.listen(5050);
}
bootstrap();


