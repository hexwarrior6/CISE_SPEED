import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Get email configuration from environment
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
        user: emailUser, // email address
        pass: emailPassword, // email password/authorization code
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
        from, // sender email with optional name
        to, // recipient email
        subject, // email subject
        text, // plain text content (optional)
        html, // HTML content
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
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
        from, // sender email with optional name
        to: to.join(', '), // multiple recipients
        subject, // email subject
        text, // plain text content (optional)
        html, // HTML content
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Bulk email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Bulk email sending failed:', error);
      return false;
    }
  }
}