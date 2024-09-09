import {
  Controller,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor() {}

  @UseGuards(AuthGuard('local-user'))
  @Post('login')
  login(@Request() req) {
    console.log('test')
    return req.user;
  }
}
