import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id, role: user.role });

    return { token };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  /*
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }
*/
  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
  async makeAdmin(superAdminId: string, userId: string): Promise<User> {
    console.log('makeAdmin called with superAdminId:', superAdminId);
    const superAdmin = await this.userModel.findById(superAdminId);

    if (superAdmin.role !== ('superadmin' as UserRole)) {
      console.log(superAdmin);
      throw new ForbiddenException('Only a superadmin can perform this action');
    }

    const user = await this.userModel.findById(userId);
    user.role = 'admin';
    return user.save();
  }
  async makeUser(superAdminId: string, userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    user.role = 'user';
    return user.save();
  }
  async findUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }
}
