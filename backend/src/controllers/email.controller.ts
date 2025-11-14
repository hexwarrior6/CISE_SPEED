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
        message: '邮件发送成功',
      };
    } else {
      return {
        success: false,
        message: '邮件发送失败',
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
        message: '批量邮件发送成功',
      };
    } else {
      return {
        success: false,
        message: '批量邮件发送失败',
      };
    }
  }

  @Get('test')
  async testEmail(@Query('to') to: string, @Query('fromName') fromName?: string) {
    const result = await this.emailService.sendMail(
      to,
      '测试邮件',
      '<h1>这是一封测试邮件</h1><p>邮件发送功能正常工作。</p>',
      '这是一封测试邮件，邮件发送功能正常工作。',
      fromName,
    );

    if (result) {
      return {
        success: true,
        message: '测试邮件发送成功',
      };
    } else {
      return {
        success: false,
        message: '测试邮件发送失败',
      };
    }
  }
}