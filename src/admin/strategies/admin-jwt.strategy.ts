import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { AdminService } from '../admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    console.log('passport validate admin test');
    const admin = await this.adminService.findAdminById(payload.id);
    return {
      adminId: payload.id,
      username: payload.name,
      email: admin.email,
      role: admin.role,
    };
  }
}
