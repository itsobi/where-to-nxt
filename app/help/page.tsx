import { currentUser } from '@clerk/nextjs/server';
import { CSForm } from './_components/CSForm';
import { redirect } from 'next/navigation';

export default async function HelpPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const email = user.emailAddresses[0].emailAddress;
  const username = user.username;

  return <CSForm username={username!} email={email} />;
}
