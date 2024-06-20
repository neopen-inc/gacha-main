import { MailService, MailDataRequired } from '@sendgrid/mail';

export const sendMail = async (
  sendGridApiKey: string,
  from: string,
  mailData: MailDataRequired,
) => {
  const sgMail = new MailService();
  sgMail.setApiKey(sendGridApiKey);
  const bodySend = {
    ...mailData,
    from,
    mail_settings: {
      sandbox_mode: {
        enable: process.env.NODE_ENV === 'test',
      },
    },
  };
  await sgMail.send(bodySend);
};
