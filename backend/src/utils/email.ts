import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();

    console.log(' ethereal mail account for testing', testAccount);

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail(options);

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } else {
    // Configure for your production email service here
    // ...
  }
};
