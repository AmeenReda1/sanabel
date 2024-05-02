import { IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionDto {
  @IsNotEmpty({ message: 'Permission Id Required' })
  @IsNumber()
  permissionId: number;
}
