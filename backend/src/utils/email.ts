import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { ApiError } from './ApiError';

// Email configuration types
interface EmailConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

// Email options with required fields
interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html: string;
  attachments?: SendMailOptions['attachments'];
  cc?: string | string[];
  bcc?: string | string[];
}

// Email template type
interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: Transporter;
  private readonly from: string;
  private static instance: EmailService;

  private constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: config.auth,
      secure: config.port === 465, // Enable TLS for port 465
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
    this.from = config.from;
  }

  // Singleton pattern to ensure single instance
  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      const config: EmailConfig = {
        host: process.env.EMAIL_HOST!,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        auth: {
          user: process.env.EMAIL_USER!,
          pass: process.env.EMAIL_PASS!,
        },
        from: process.env.EMAIL_FROM!,
      };
      EmailService.instance = new EmailService(config);
    }
    return EmailService.instance;
  }

  // Verify email configuration
  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email configuration error:', error);
      return false;
    }
  }

  // Send email with retry logic
  public async sendEmail(options: EmailOptions, retries = 3): Promise<void> {
    try {
      const mailOptions = {
        from: this.from,
        ...options,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      if (retries > 0) {
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.sendEmail(options, retries - 1);
      }
      throw new ApiError(500, `Failed to send email: ${error.message}`);
    }
  }

  // Email templates
  private readonly templates = {
    welcomeEmail: (name: string): EmailTemplate => ({
      subject: 'Welcome to LaunchKit! 🚀',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for joining LaunchKit. We're excited to have you on board!</p>
      `,
    }),

    passwordReset: (resetUrl: string): EmailTemplate => ({
      subject: 'Password Reset Request',
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    }),

    verifyEmail: (verifyUrl: string): EmailTemplate => ({
      subject: 'Verify Your Email',
      html: `
        <h2>Verify Your Email</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    }),
  };

  // Template-based email sending methods
  public async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const template = this.templates.welcomeEmail(name);
    await this.sendEmail({ to, ...template });
  }

  public async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    const template = this.templates.passwordReset(resetUrl);
    await this.sendEmail({ to, ...template });
  }

  public async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    const template = this.templates.verifyEmail(verifyUrl);
    await this.sendEmail({ to, ...template });
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
