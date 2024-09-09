import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Lang } from "../entities/news.entity";

export class CreateNewsDto {

    @IsNotEmpty({ message: 'News Title is required' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'News image is required' })
    @IsString()
    image: string;

    @IsNotEmpty({ message: 'News description is required' })
    description: JSON;

    @IsNotEmpty({ message: 'News Lang is required' })
    @IsEnum(Lang)
    lang: Lang

}
