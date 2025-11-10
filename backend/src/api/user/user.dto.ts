// create-user.dto.ts
import { UserRole } from './user.schema';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

// login-user.dto.ts
export class LoginUserDto {
  email: string;
  password: string;
}

// login-response.dto.ts
export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}