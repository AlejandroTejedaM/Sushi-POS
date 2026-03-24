import { ClassConstructor } from 'class-transformer';
import { SetMetadata } from '@nestjs/common';

export const SERIALIZE_WITH_KEY = 'serializeWith';
export function SerializeWith(dto: ClassConstructor<unknown>): MethodDecorator {
  return SetMetadata(SERIALIZE_WITH_KEY, dto);
}
