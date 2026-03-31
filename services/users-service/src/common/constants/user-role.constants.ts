export const UserRole = {
  ADMIN: 'ADMIN',
  WAITER: 'WAITER',
  KITCHEN: 'KITCHEN'
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
