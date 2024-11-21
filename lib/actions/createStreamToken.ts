'use server';

import { StreamChat } from 'stream-chat';

export const createStreamToken = async (userId: string): Promise<string> => {
  const streamApiKey = process.env.STREAM_API_KEY;
  const streamSecretKey = process.env.STREAM_SECRET_KEY;

  if (!streamApiKey || !streamSecretKey) {
    throw new Error('STREAM_API_KEY or STREAM_SECRET_KEY is not set');
  }

  const serverClient = StreamChat.getInstance(streamApiKey, streamSecretKey);

  return serverClient.createToken(userId);
};
