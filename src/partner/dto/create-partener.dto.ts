import { IsNotEmpty, IsString } from "class-validator";

export class CreatePartenerDto {
    @IsNotEmpty({ message: 'Partner name is required' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'Partner image is required' })
    @IsString()
    image: string;

    @IsNotEmpty({ message: 'Partner Link is required' })
    @IsString()
    link: string
}
