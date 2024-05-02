import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AdminDto {
  @ApiProperty({
    description: 'Admin Name',
    example: 'john deo',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Admin email',
    example: 'john@gmail.com',
  })
  @IsNotEmpty({ message: 'Admin Email required' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin Password',
    example: 'test123',
  })
  @IsNotEmpty({ message: 'Password Admin Password required' })
  @MinLength(4, { message: 'This is short Password Try to make longer one' })
  @MaxLength(20, { message: 'This is Long Password Try to make Smaller one' })
  password: string;
}
