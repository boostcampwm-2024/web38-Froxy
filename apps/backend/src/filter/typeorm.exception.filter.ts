import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class typeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(typeOrmExceptionFilter.name);
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Log the error details
    console.error({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database query failed',
      error: exception.message,
      query: exception.query, // 실패한 쿼리
      parameters: exception.parameters // 쿼리 파라미터
    });

    // Send only status code and message to the client
    const errorResponse = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database query failed'
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
