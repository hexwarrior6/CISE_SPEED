import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from '../controllers/email.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [EmailService, ConfigService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}