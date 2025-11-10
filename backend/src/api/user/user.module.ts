// user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';

// Helper function to convert time string to seconds
function parseTimeToSeconds(timeString: string): number {
  const regex = /^(\d+)([smhd])$/;
  const match = timeString.match(regex);
  
  if (!match) {
    // Default to 1 hour if format is not recognized
    return 3600;
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return 3600; // fallback to 1 hour
  }
}

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: () => {
        const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
        const expiresInSeconds = typeof expiresIn === 'string' 
          ? parseTimeToSeconds(expiresIn) 
          : expiresIn;

        return {
          secret: process.env.JWT_SECRET || 'default_secret',
          signOptions: { 
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}