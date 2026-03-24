import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ApiResponseDto } from '../dto/api-response.dto';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { SERIALIZE_WITH_KEY } from '../decorators/serialize-with.decorator';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponseDto<T>> {
    const customMessage: string = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [context.getHandler(), context.getClass()]);
    const serializeDto: ClassConstructor<unknown> = this.reflector.getAllAndOverride<ClassConstructor<unknown>>(SERIALIZE_WITH_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    return next.handle().pipe(
      map((data: T) => {
        if (data instanceof ApiResponseDto) {
          return data;
        }
        let serialized: unknown = data;

        if (serializeDto) {
          serialized = plainToInstance(serializeDto, data, { excludeExtraneousValues: true, enableImplicitConversion: true });
        }

        return ApiResponseDto.success(serialized as T, customMessage);
      })
    );
  }
}
