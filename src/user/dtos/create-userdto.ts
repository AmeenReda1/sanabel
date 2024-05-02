import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
  COMPANY_USER = 'Company_User',
  COMAPNY_OWNER = 'Company_Owner',
}
export class CreateUserDto {
  @ApiProperty({
    description: 'user Name',
    example: 'john deo',
  })
  @IsNotEmpty({ message: 'User Name Required' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@gmail.com',
  })
  @IsNotEmpty({ message: ' User Email Required' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User Password',
    example: 'test123',
  })
  @IsNotEmpty({ message: 'User Password Required' })
  @IsString()
  password: string;
  @ApiProperty({
    description: 'Admin Password',
    enum: UserRole,
  })
  @IsNotEmpty({ message: 'User Role Required' })
  @IsEnum(UserRole)
  role: UserRole;
}
