'use client';

import 'stream-chat-react/dist/css/v2/index.css';

import { useCallback, useState } from 'react';
import { ChannelSort, StreamChat } from 'stream-chat';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  DefaultStreamChatGenerics,
  MessageInput,
  MessageList,
  Thread,
  useCreateChatClient,
  Window,
} from 'stream-chat-react';

interface ChatPageProps {
  apiKey: string;
  createToken: (userId: string) => Promise<string>;
  userId: string;
  username: string;
  image: string;
}

export function ChatPage({
  apiKey,
  userId,
  username,
  image,
  createToken,
}: ChatPageProps) {
  const tokenProvider = useCallback(async () => {
    return await createToken(userId);
  }, [createToken, userId]);

  const client = useCreateChatClient({
    apiKey: apiKey,
    tokenOrProvider: tokenProvider,
    userData: {
      id: userId,
      name: username,
      image,
    },
  });

  const sort: ChannelSort<DefaultStreamChatGenerics> = { last_message_at: -1 };
  const filters = {
    type: 'messaging',
    members: { $in: [userId] },
  };
  const options = { limit: 10 };

  if (!client)
    return (
      <div className="text-center text-primary-blue">
        Setting up the client and connection...
      </div>
    );

  return (
    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
