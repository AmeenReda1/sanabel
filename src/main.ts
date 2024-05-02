import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// we need to import it to make transports.DailyRotate is available
import 'winston-daily-rotate-file';
import { LoggerService } from './common/LoggerService';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 9000;
  console.log(configService.get<number>('PORT'));
  const config = new DocumentBuilder()
    .setTitle('ERD Nest Projrct')
    .setDescription('The ERD API description')
    .setVersion('1.0')
    .addTag('ERD Nest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(port);
}
bootstrap();
