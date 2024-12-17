import { clerkClient, User } from '@clerk/nextjs/server';

export const getUserById = async (userId: string | undefined) => {
  if (!userId) {
    return null;
  }

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  if (!user) {
    return null;
  }

  return user as User;
};
