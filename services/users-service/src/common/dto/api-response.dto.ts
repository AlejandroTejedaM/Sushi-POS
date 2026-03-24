import { SuccessMessages } from '../constants/success-messages';

export class ApiResponseDto<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly message: string;
  readonly errorCode?: string;
  readonly timestamp: string;

  public static success<T>(data: T, message?: string): ApiResponseDto<T> {
    return Object.assign(new ApiResponseDto<T>(), {
      success: true,
      data: data ?? null,
      message: message ?? SuccessMessages.SUCCESS,
      timestamp: new Date().toISOString()
    });
  }

  public static error(message: string, errorCode?: string): ApiResponseDto<null> {
    return Object.assign(new ApiResponseDto<null>(), {
      success: false,
      data: null,
      message,
      errorCode,
      timestamp: new Date().toISOString()
    });
  }
}
