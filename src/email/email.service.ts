import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailOptions } from './email.interface';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  async sendPassWordResetEmail(mailOptions: EmailOptions) {
    return await this.mailService.sendMail({
      to: mailOptions.email,
      subject: mailOptions.subject,
      text: mailOptions.message,
    });
  }
}
