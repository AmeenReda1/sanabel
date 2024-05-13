import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.enitity';
import { Repository } from 'typeorm';
import { AdminDto } from './dtos/admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForgetPasswordDto } from 'src/common/dtos/forget-password.dto';
import { v4 as uuid } from 'uuid';
import { EmailService } from 'src/email/email.service';
import { UUID } from 'crypto';
import { EmailOptions } from 'src/email/email.interface';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async createAdmin(adminDto: AdminDto): Promise<Admin> {
    const { email } = adminDto;
    const existingAdmin = await this.adminRepository.findOne({
      where: { email },
    });
    if (existingAdmin) {
      throw new ConflictException(
        `This Admin Email ${email} used by anthor Admin`,
      );
    }
    const newAdmin = this.adminRepository.create(adminDto);
    return this.adminRepository.save(newAdmin);
  }
  async validateAdmin(email: string, pass: string) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email },
    });
    if (!existingAdmin) {
      throw new NotFoundException(`Admin Email OR Password Not Correct`);
    }

    const checkPasword = await bcrypt.compare(pass, existingAdmin.password);
    if (!checkPasword) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: existingAdmin.id,
      email: existingAdmin.email,
      name: existingAdmin.name,
    };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { existingAdmin, token };
  }
  async deleteAdmin(email: string) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email },
    });
    if (!existingAdmin) {
      throw new NotFoundException(`There Is No Admin With This Email ${email}`);
    }
    const { id } = existingAdmin;
    await this.adminRepository.delete({ id });
  }
  async forgetPasword(forgetPassowrdDto: ForgetPasswordDto) {
    //  check if the email exists and send token via email
    const { email } = forgetPassowrdDto;
    const exsitingUser = await this.adminRepository.findOne({
      where: { email },
    });
    if (!exsitingUser) {
      throw new NotFoundException(`There is No User With This Email ${email}`);
    }
    const tokenUuId: string = uuid();
    console.log(tokenUuId);
    const subject = `Reset Password Mail From ERD project`;
    const message = `${process.env.BASE_URL}/user/resetPassword?token=${tokenUuId}`;
    const mailOption: EmailOptions = { email, subject, message };
    try {
      await this.emailService.sendPassWordResetEmail(mailOption);
      exsitingUser.tokenId = tokenUuId;
      exsitingUser.tokenValid = new Date(Date.now() + 10 * 60 * 1000);
      await this.adminRepository.save(exsitingUser);
    } catch (err) {
      exsitingUser.tokenId = null;
      exsitingUser.tokenValid = null;
      await this.adminRepository.save(exsitingUser);
    }
  }
  async resetPassword(token: UUID, newPassword: string) {
    const existingUser = await this.adminRepository.findOne({
      where: { tokenId: token },
    });
    if (!existingUser) {
      throw new NotFoundException(`There is No User with This Id`);
    }
    console.log(existingUser.tokenValid);
    console.log(new Date());
    const tokenValid = existingUser.tokenValid.getTime();
    const currentTime = Date.now();
    if (existingUser.tokenId === token) {
      if (tokenValid < currentTime) {
        throw new UnauthorizedException(`Email Token Has Expired`);
      }
      existingUser.password = newPassword;
      existingUser.tokenValid = null;
      existingUser.tokenId = '';
      const saveUser = this.adminRepository.create(existingUser);
      await this.adminRepository.save(saveUser);
    } else {
      throw new UnauthorizedException(`Invalid Email Token`);
    }
  }
  async findAdminById(id: number): Promise<Admin> {
    const existingAdmin = await this.adminRepository.findOne({ where: { id } });
    if (!existingAdmin) {
      throw new NotFoundException(`There is No Admin With This Id`);
    }
    return existingAdmin;
  }
  async findAllAdmins(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }
}
