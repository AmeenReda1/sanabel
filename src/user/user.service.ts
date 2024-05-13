import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-userdto';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/role.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForgetPasswordDto } from '../common/dtos/forget-password.dto';
import { EmailService } from 'src/email/email.service';
import { EmailOptions } from 'src/email/email.interface';
import { v4 as uuid } from 'uuid';
import { UUID } from 'crypto';
import { ProductService } from 'src/product/product.service';
import { Company } from 'src/company/company.entity';
import { CompanyService } from 'src/company/company.service';
import { Paginated, paginate } from 'nestjs-paginate';
import { userPaginateConfig } from './config/user-pagination.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private productService: ProductService,
    // private companyService: CompanyService,
  ) {}
  async findAll(query): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, userPaginateConfig);
  }
  async createUser(createUserDto: CreateUserDto, owner = false): Promise<User> {
    const { email, role, ...otherProps } = createUserDto;
    console.log(role);
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException(`User with this email already exists`);
    }

    const query = { where: { roleName: role } };
    const roleEntity: Role = await this.roleService.findOne(query);
    // Convert CreateUserDto to DeepPartial<User>
    const newUser: DeepPartial<User> = {
      email,
      role: roleEntity,
      ...otherProps,
    };
    const savedUser = await this.userRepository.create(newUser);
    if (owner) {
      return savedUser;
    }

    return await this.userRepository.save(savedUser);
  }
  async validateUser(email: string, pass: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new NotFoundException(`User Email OR Password Not Correct `);
    }

    const checkPasword = await bcrypt.compare(pass, existingUser.password);
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
  async forgetPasword(forgetPassowrdDto: ForgetPasswordDto) {
    //  check if the email exists and send token via email
    const { email } = forgetPassowrdDto;
    const exsitingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (!exsitingUser) {
      throw new NotFoundException(`There is No User With This Email ${email}`);
    }
    const tokenUuId: string = uuid();

    const subject = `Reset Password Mail From ERD project`;
    const message = `${process.env.BASE_URL}user/resetPassword?token=${tokenUuId}`;
    const mailOption: EmailOptions = { email, subject, message };
    try {
      await this.emailService.sendPassWordResetEmail(mailOption);
      exsitingUser.tokenId = tokenUuId;
      exsitingUser.tokenValid = new Date(Date.now() + 10 * 60 * 1000);
      await this.userRepository.save(exsitingUser);
    } catch (err) {
      exsitingUser.tokenId = null;
      exsitingUser.tokenValid = null;
      await this.userRepository.save(exsitingUser);
    }
  }
  async resetPassword(token: UUID, newPassword: string) {
    const existingUser = await this.userRepository.findOne({
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
      const saveUser = this.userRepository.create(existingUser);
      await this.userRepository.save(saveUser);
    } else {
      throw new UnauthorizedException(`Invalid Email Token`);
    }
  }
  async findUserById(id: number): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`There is No User With This Id`);
    }
    return existingUser;
  }
  async assignProductToUser(
    company: Company,
    userId: number,
    productId: number,
  ): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { id: userId, company: company },
    });
    if (!userExists) {
      throw new NotFoundException(`There isn't User with this Id ${userId}`);
    }
    const productExists = await this.productService.findProductById(productId);
    if (!productExists) {
      throw new NotFoundException(
        `There isn't product with this Id ${productId}  `,
      );
    }
    // check if the user have The Product Already Or Not
    const userProductsIds: number[] = [];
    userExists.has.forEach((product) => {
      userProductsIds.push(product.id);
    });
    if (userProductsIds.includes(productId)) {
      throw new ConflictException(`This User ALready Has This Product`);
    }
    userExists.has.push(productExists);
    return await this.userRepository.save(userExists);
  }
  async assignCompanyToUser(userId: number, company: Company) {
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userExists) {
      throw new NotFoundException(`There Is No User With This Id ${userId}`);
    }
    if (userExists.company) {
      throw new ConflictException(
        `This user with this Id ${userId} Already In A Company`,
      );
    }
    userExists.company = company;
    console.log(userExists);
    return await this.userRepository.save(userExists);
  }
}
