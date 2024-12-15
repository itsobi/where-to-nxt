import { PROJECT_URL } from '@/lib/constants';

interface WelcomeEmailTemplateProps {
  username: string;
}

export function WelcomeEmailTemplate({
  username,
}: Readonly<WelcomeEmailTemplateProps>) {
  return (
    <div>
      <h2>Hello {username}! We&apos;re glad to have you onboard.</h2>
      <h3>
        If you ever need help, please reach out to us{' '}
        <a
          href={`${PROJECT_URL}/help`}
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </h3>
      <footer>
        <p>
          This is an automated message. Please do not reply to this email. If
          you need assistance, visit our{' '}
          <a
            href={`${PROJECT_URL}/help`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Customer Support Page
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

interface PaymentFailedEmailTemplateProps {
  username: string;
  amount: string;
}

export function PaymentFailedEmailTemplate({
  username,
  amount,
}: Readonly<PaymentFailedEmailTemplateProps>) {
  return (
    <div>
      <h2>
        Hello {username}. Unfortunately your payment of ${amount} failed.
      </h2>
      <h3>
        Please try again, and If you need help, please reach out to us{' '}
        <a
          href={`${PROJECT_URL}/help`}
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </h3>
      <footer>
        <p>
          This is an automated message. Please do not reply to this email. If
          you need assistance, visit our{' '}
          <a
            href={`${PROJECT_URL}/help`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Customer Support Page
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

interface PaymentSucceededEmailTemplateProps {
  username: string;
  amount: string;
}

export function PaymentSucceededEmailTemplate({
  username,
  amount,
}: Readonly<PaymentSucceededEmailTemplateProps>) {
  return (
    <div>
      <h2>
        Hello {username}. Your payment of ${amount} succeeded!
      </h2>
      <h3>
        Take a look at the{' '}
        <a
          href={`${PROJECT_URL}/messages`}
          target="_blank"
          rel="noopener noreferrer"
        >
          messages
        </a>
        tab and start chatting with people all over the world!
      </h3>

      <footer>
        <p>
          This is an automated message. Please do not reply to this email. If
          you need assistance, visit our{' '}
          <a
            href={`${PROJECT_URL}/help`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Customer Support Page
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

interface CustomerSupportEmailTemplateProps {
  username: string;
}

export function CustomerSupportEmailTemplate({
  username,
}: Readonly<CustomerSupportEmailTemplateProps>) {
  return (
    <div>
      <h2>
        Hello {username}, We have received your ticket and will get back to you
        within 8 hours!
      </h2>

      <footer>
        <p>
          This is an automated message. Please do not reply to this email. If
          you need assistance, visit our{' '}
          <a
            href={`${PROJECT_URL}/help`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Customer Support Page
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

interface InternalCustomerSupportEmailTemplateProps {
  username: string;
  email: string;
  subject: string;
  message: string;
}

export function InternalCustomerSupportEmailTemplate({
  username,
  email,
  subject,
  message,
}: Readonly<InternalCustomerSupportEmailTemplateProps>) {
  return (
    <div>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>Subject: {subject}</p>
      <p>Message: {message}</p>
    </div>
  );
}
