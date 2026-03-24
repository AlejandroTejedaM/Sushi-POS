import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'responseMessage';
export function ResponseMessage(message: string): MethodDecorator {
  return SetMetadata(RESPONSE_MESSAGE_KEY, message);
}
