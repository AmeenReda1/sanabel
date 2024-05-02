import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({ description: 'Email' })
  @IsNotEmpty({ message: ' User Email Required' })
  @IsEmail()
  email: string;
}
