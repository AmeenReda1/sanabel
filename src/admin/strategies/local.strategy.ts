import { Strategy } from 'passport-local';
import { AdminService } from '../admin.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminService: AdminService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, passsword: string) {
    console.log('Email: ', email, 'password: ', passsword);
    const admin = await this.adminService.validate(email, passsword);

    if (admin) return admin;
    else return null;
  }
}
