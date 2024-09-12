import { SetMetadata } from '@nestjs/common';

export const Role_Key = 'role';
export const Role = (role: string) =>
  SetMetadata(Role_Key, role);
