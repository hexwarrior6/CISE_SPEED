import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // 从配置中获取邮箱相关设置
    const emailHost = this.configService.get<string>('EMAIL_HOST');
    const emailPort = this.configService.get<number>('EMAIL_PORT');
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');
    const emailSecure = this.configService.get<string>('EMAIL_SECURE') === 'true';

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure, // true for 465, false for other ports
      auth: {
        user: emailUser, // 邮箱地址
        pass: emailPassword, // 邮箱授权码
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    text?: string,
    fromName?: string,
  ): Promise<boolean> {
    try {
      const emailUser = this.configService.get<string>('EMAIL_USER');
      const from = fromName ? `"${fromName}" <${emailUser}>` : emailUser;

      const mailOptions = {
        from, // 发件人邮箱，包含可选的发件人名称
        to, // 收件人邮箱
        subject, // 邮件主题
        text, // 纯文本内容（可选）
        html, // HTML 内容
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('邮件发送成功:', info.messageId);
      return true;
    } catch (error) {
      console.error('邮件发送失败:', error);
      return false;
    }
  }

  async sendBulkMail(
    to: string[],
    subject: string,
    html: string,
    text?: string,
    fromName?: string,
  ): Promise<boolean> {
    try {
      const emailUser = this.configService.get<string>('EMAIL_USER');
      const from = fromName ? `"${fromName}" <${emailUser}>` : emailUser;

      const mailOptions = {
        from, // 发件人邮箱，包含可选的发件人名称
        to: to.join(', '), // 多个收件人
        subject, // 邮件主题
        text, // 纯文本内容（可选）
        html, // HTML 内容
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('批量邮件发送成功:', info.messageId);
      return true;
    } catch (error) {
      console.error('批量邮件发送失败:', error);
      return false;
    }
  }
}