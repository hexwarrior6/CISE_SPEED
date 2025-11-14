import { Controller, Post, Get, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { IsEmail, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  fromName?: string;
}

class SendBulkEmailDto {
  @IsArray()
  @IsEmail({}, { each: true })
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  fromName?: string;
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const { to, subject, html, text, fromName } = sendEmailDto;
    const result = await this.emailService.sendMail(to, subject, html, text, fromName);

    if (result) {
      return {
        success: true,
        message: 'Email sent successfully',
      };
    } else {
      return {
        success: false,
        message: 'Email sending failed',
      };
    }
  }

  @Post('send-bulk')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendBulkEmail(@Body() sendBulkEmailDto: SendBulkEmailDto) {
    const { to, subject, html, text, fromName } = sendBulkEmailDto;
    const result = await this.emailService.sendBulkMail(to, subject, html, text, fromName);

    if (result) {
      return {
        success: true,
        message: 'Bulk email sent successfully',
      };
    } else {
      return {
        success: false,
        message: 'Bulk email sending failed',
      };
    }
  }

  @Get('test')
  async testEmail(@Query('to') to: string, @Query('fromName') fromName?: string) {
    const result = await this.emailService.sendMail(
      to,
      'Test Email',
      '<h1>This is a test email</h1><p>Email sending functionality is working properly.</p>',
      'This is a test email, email sending functionality is working properly.',
      fromName,
    );

    if (result) {
      return {
        success: true,
        message: 'Test email sent successfully',
      };
    } else {
      return {
        success: false,
        message: 'Test email sending failed',
      };
    }
  }
}