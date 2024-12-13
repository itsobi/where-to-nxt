'use server';

import {
  CustomerSupportEmailTemplate,
  InternalCustomerSupportEmailTemplate,
} from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCSTicket = async (formData: FormData) => {
  const username = formData.get('username')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const subject = formData.get('subject')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!username || !email || !subject || !message) {
    return { success: false, message: 'All fields are required' };
  }

  const { error: internalEmailError } = await resend.emails.send({
    from: 'support@wheretonxt.com',
    to: ['obi.j.obialo@gmail.com'],
    subject: 'Your ticket has been created',
    react: InternalCustomerSupportEmailTemplate({
      username,
      email,
      subject,
      message,
    }),
  });

  if (internalEmailError) {
    return { success: false, error: 'Failed to send email' };
  }

  const { error: alertUserError } = await resend.emails.send({
    from: 'support@wheretonxt.com',
    to: [email],
    subject: 'Your ticket has been created',
    react: CustomerSupportEmailTemplate({ username }),
  });

  if (alertUserError) {
    return { success: false, error: 'Failed to send email' };
  }

  return {
    success: true,
    message: 'Your Customer Support ticket has been created.',
  };
};
