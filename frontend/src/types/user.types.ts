// types/user.types.ts

export enum UserRole {
  SUBMITTER = 'Submitter',
  MODERATOR = 'Moderator',
  ANALYST = 'Analyst',
  SEARCHER = 'Searcher',
  ADMINISTRATOR = 'Administrator',
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}