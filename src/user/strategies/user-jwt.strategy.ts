import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { User } from '../user.entity';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    console.log('test');

    const user = await this.userService.findById(payload.id);
    console.log({
      userId: payload.id,
      username: payload.name,
      email: user.email,
      role: user.role,
      company: user.company,
    });
    return {
      userId: payload.id,
      username: payload.name,
      email: user.email,
      role: user.role,
      company: user.company,
    };
  }
}
