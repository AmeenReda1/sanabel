import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../user.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-user') {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, passsword: string) {
    const user = await this.userService.validateUser(email, passsword);
    console.log(user);
    if (user) return user;
    else return null;
  }
}
