import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class httpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(httpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(`HTTP ${status} Error: ${exception.getResponse()} | Path: ${request.url}`);

    response.status(status).json({
      code: status,
      message: exception.getResponse(),
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}
