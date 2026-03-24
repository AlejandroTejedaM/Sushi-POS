import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ApiResponseDto } from '../dto/api-response.dto';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    const { statusCode, message, errorCode } = this.resolveException(exception);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    const body: ApiResponseDto<null> = ApiResponseDto.error(message, errorCode);
    response.status(statusCode).json(body);
  }

  private resolveException(exception: unknown): { statusCode: number; message: string; errorCode?: string } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return { statusCode: status, message: exceptionResponse };
      }

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>;
        const message: string = Array.isArray(res['message']) ? res['message'].join(', ') : ((res['message'] as string) ?? exception.message);

        return {
          statusCode: status,
          message,
          errorCode: res['error'] as string | undefined
        };
      }
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.UNEXPECTED_ERROR
    };
  }
}
