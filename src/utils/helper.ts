import { ulid } from 'ulid';

export const generateTenantId = (): string => {
  return ulid();
};
