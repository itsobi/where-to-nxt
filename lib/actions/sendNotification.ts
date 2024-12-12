'use server';

import { Knock } from '@knocklabs/node';
import { revalidatePath } from 'next/cache';
import { PROJECT_URL } from '../constants';

if (!process.env.KNOCK_SECRET_KEY) {
  throw new Error('KNOCK_SECRET_KEY is not set');
}

const knock = new Knock(process.env.KNOCK_SECRET_KEY);

export const sendNewMessageNotification = async ({
  userId,
  username,
  chatRoomId,
  recipientUserId,
}: {
  userId: string | undefined;
  username: string | null | undefined;
  chatRoomId: string;
  recipientUserId: string | undefined;
}) => {
  if (!userId || !username || !recipientUserId) return false;
  try {
    await knock.workflows.trigger('new-message', {
      actor: {
        id: userId,
      },
      data: {
        sender: username,
        link: `${PROJECT_URL}/messages/${chatRoomId}`,
      },
      recipients: [{ id: recipientUserId }],
    });

    revalidatePath('/');

    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};
