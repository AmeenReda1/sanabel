import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionDto {
  id: number;

  @ApiProperty({ description: 'Permssion Name Required' })
  @IsNotEmpty()
  @IsString()
  permission_name: string;
}
