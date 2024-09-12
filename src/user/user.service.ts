import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }
  async validateUser(email: string, pass: string) {
    const existingUser = await this.userRepository.findOne({where:{email}});
    console.log(existingUser)
    if (!existingUser) {
      throw new NotFoundException(`User Email OR Password Not Correct `);
    }

    const checkPasword = await bcrypt.compare(pass, existingUser.password);
    console.log(checkPasword)
    if (!checkPasword) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { existingUser, token };
  }

  async findById(id: number): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`There is No User With This Id`);
    }
    return existingUser;
  }
}
