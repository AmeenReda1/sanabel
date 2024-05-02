import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpServer,
} from '@nestjs/common';
import { timeStamp } from 'console';
import { Request, Response } from 'express';
import { Timestamp } from 'typeorm';
import { LoggerService } from '../LoggerService';

@Catch(HttpException)
export class CustomExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const loggerService = new LoggerService();
    loggerService.logError(exception.message, request.url);

    response.status(status).json({
      statusCode: status,
      timeStamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
