import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as os from 'os';
import { generateFileName, imageFileFilter } from './utils/file-upload';
import { diskStorage } from 'multer';
import { join } from 'path';
const tempPath = os.tmpdir();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: `./images`,
  //       filename: generateFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  // async upload(@UploadedFile() file: Express.Multer.File) {
  //   return  { url: file.filename };
  // }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: `.src/public/images`,
        destination: join(__dirname,'..','public', 'images'), // Ensure this path is correct
        filename: generateFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const imagePath = process.env.BASE_URL+`public/images/${file.filename}`
      return { url: imagePath  };
    } else {
      throw new Error('File upload failed');
    }
  }


}




