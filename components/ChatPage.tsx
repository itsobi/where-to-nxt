'use client';

import 'stream-chat-react/dist/css/v2/index.css';

import { useCallback, useEffect, useState } from 'react';
import { Channel as StreamChannel, ChannelSort, StreamChat } from 'stream-chat';
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
import { useMediaQuery } from '@/lib/useMediaQuery';
import { BackButton } from './BackButton';

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
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [channel, setChannel] = useState<StreamChannel>();
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

  useEffect(() => {
    if (!client) return;

    const channel = client.channel('messaging', {
      name: 'test',
      members: [
        'user_2nlw60cA8F447iOC5j7zyEskOmp',
        'user_2pEkPoosTFmEjI3zL9z6ANXGk5A',
      ],
    });

    setChannel(channel);
  }, [client]);

  if (!client)
    return (
      <div className="text-center text-primary-blue">
        Setting up the client and connection...
      </div>
    );

  return (
    <div className="h-screen">
      <Chat client={client}>
        <div className="flex h-full">
          <ChannelList filters={filters} sort={sort} options={options} />

          <div className="w-3/4 flex flex-col">
            <Channel>
              <Window>
                {!isLargeScreen && <BackButton label="Back" />}
                <ChannelHeader />
                <div className="h-full overflow-y-auto">
                  <MessageList />
                </div>
                <MessageInput />
                <div className="pb-6" />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </Chat>
    </div>
  );
}
