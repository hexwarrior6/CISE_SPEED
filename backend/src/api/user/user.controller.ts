import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  HttpException,
  HttpStatus,
  UseGuards,
  Param,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, LoginResponseDto } from './user.dto';
import { AdminGuard } from './admin.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Registration endpoint - all users register as Submitter by default
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.userService.register(createUserDto);
      // Don't return the password in the response
      const { password, ...result } = user.toObject();
      return {
        message: 'User registered successfully',
        user: {
          ...result,
          id: user._id.toString(), // Ensure id field is properly mapped
        },
      };
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

  // Get all users (admin only)
  @Get('/')
  @UseGuards(AdminGuard)
  async findAll() {
    try {
      const users = await this.userService.findAll();
      // Map users to ensure proper id field is present
      return users.map((user) => ({
        ...user.toObject(),
        id: user._id.toString(), // Ensure id field is properly mapped
      }));
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

  // Update user role (admin only)
  @Put('/:id/role')
  @UseGuards(AdminGuard)
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string },
  ) {
    try {
      const validRoles = [
        'Submitter',
        'Moderator',
        'Analyst',
        'Searcher',
        'Administrator',
      ];
      if (!validRoles.includes(body.role)) {
        throw new Error('Invalid role');
      }

      // Update the user's role
      const updatedUser = await this.userService.update(id, {
        role: body.role as any,
      });
      if (!updatedUser) {
        throw new Error('User not found');
      }

      return {
        message: 'User role updated successfully',
        user: {
          ...updatedUser.toObject(),
          id: updatedUser._id.toString(), // Ensure id field is properly mapped
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message || 'Unable to update user role',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
}
