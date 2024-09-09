import { IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'phone is required' })
    @IsString()
    phone: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    email: string;

    @IsNotEmpty({ message: 'Message is required' })
    @IsString()
    message: string;


}
