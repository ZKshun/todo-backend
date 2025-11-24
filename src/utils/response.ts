// src/utils/response.ts

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}

export function success<T>(data: T, message = 'OK', code = 0): ApiResponse<T> {
  return {
    success: true,
    code,
    message,
    data
  };
}

export function fail(message = 'Error', code = 500): ApiResponse<null> {
  return {
    success: false,
    code,
    message
  };
}
