import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Lang } from "src/news/entities/news.entity";

export class CreateOfferDto {

    @IsNotEmpty({ message: 'Offer Title is required' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'Offer image is required' })
    @IsString()
    image: string;

    @IsNotEmpty({ message: 'Offer description is required' })
    description: JSON;

    @IsNotEmpty({ message: 'Offer Lang is required' })
    @IsEnum(Lang)
    lang: Lang


}
