import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = this.jwtService.verify(token);
      // Check if user role is Administrator
      return decoded.role === 'Administrator';
    } catch (error) {
      return false;
    }
  }
}