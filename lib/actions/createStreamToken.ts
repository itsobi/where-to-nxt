'use server';

import { StreamChat } from 'stream-chat';

export const createStreamToken = async (userId: string): Promise<string> => {
  const streamApiKey = process.env.STREAM_API_KEY;
  const streamSecretKey = process.env.STREAM_SECRET_KEY;

  if (!streamApiKey || !streamSecretKey) {
    throw new Error('STREAM_API_KEY or STREAM_SECRET_KEY is not set');
  }

  if (!userId) {
    throw new Error('userId is required');
  }

  const serverClient = StreamChat.getInstance(streamApiKey, streamSecretKey);

  // Set expiration to 1 hour from now (in seconds)
  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

  return serverClient.createToken(userId);
};
