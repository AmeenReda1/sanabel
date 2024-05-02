import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dtos/create-userdto';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company Name' })
  @IsNotEmpty({ message: 'company Name is required' })
  @IsString()
  company: string;
  @ApiProperty({ description: 'Company Owner Object' })
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
