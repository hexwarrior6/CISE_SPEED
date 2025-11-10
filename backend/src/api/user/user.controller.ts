import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, LoginResponseDto } from './user.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Registration endpoint
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.userService.register(createUserDto);
      // Don't return the password in the response
      const { password, ...result } = user.toObject();
      return { message: 'User registered successfully', user: result };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message || 'Unable to register user',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  // Login endpoint
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    try {
      return await this.userService.login(loginUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: error.message || 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
        { cause: error },
      );
    }
  }

  // Get all users (for admin use)
  @Get('/')
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No users found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}