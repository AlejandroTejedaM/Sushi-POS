export const ERROR_MESSAGES = {
  USER_OR_PASSWORD_INCORRECT: 'User or password incorrect',
  JWT_REFRESH_EXPIRATION_DAYS_NOT_FOUND: 'JWT_REFRESH_EXPIRATION_DAYS not found in environment',
  TOKEN_NOT_FOUND: 'Token not found',
  TOKEN_INVALID: 'Token inválido o expirado',
  UNEXPECTED_ERROR: 'Ocurrió un error inesperado',
  USER_ALREADY_EXISTS: 'User with the provided email already exists',
  ROLE_NOT_FOUND: 'Role not found',
  USER_NOT_FOUND: 'User not found',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to access this resource'
} as const;
