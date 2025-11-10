import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, LoginUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ 
      $or: [{ email: createUserDto.email }, { username: createUserDto.username }] 
    });
    
    if (existingUser) {
      throw new HttpException(
        'User with this email or username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create new user
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async login(loginUserDto: LoginUserDto) {
    // Find user by email
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user || !user.isActive) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Generate JWT token
    const payload = { 
      sub: user._id.toString(), 
      email: user.email, 
      role: user.role 
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>) {
    // If password is being updated, hash it
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}