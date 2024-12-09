import { Container } from '@/components/Container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getChatRooms } from '@/lib/queries/getChatRooms';
import { auth } from '@clerk/nextjs/server';
import { Check } from 'lucide-react';
import { redirect } from 'next/navigation';
import {
  getProUsers,
  getProUsersEligibleForConversation,
  isCurrentUserPro,
} from '@/lib/queries/getProUser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from './_components/Conversation';
import { MessagesHeader } from './_components/MessagesHeader';
import { NewChatRoomDialog } from './_components/NewChatRoomDialog';
import Link from 'next/link';

const features = [
  {
    description: 'Access to direct messaging',
  },
  {
    description: '24/7 customer support',
  },
  {
    description: 'Enabled notifications',
  },
  {
    description: 'Pro label on profile',
  },
];

export default async function MessagesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const isProMember = await isCurrentUserPro(userId);

  if (isProMember) {
    const chatRooms = await getChatRooms(userId);
    const proUsers = await getProUsers(userId);
    const availableProUsers = await getProUsersEligibleForConversation(userId);

    if (chatRooms.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-full w-full text-center">
          <h1 className="text-2xl font-semibold">Select a conversation</h1>
          <p className="text-muted-foreground">
            Continue a conversation or start a new one with a Pro user!
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 font-semibold">
                Start a conversation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[450px]">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[300px] pr-4">
                {proUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer"
                  >
                    <Avatar>
                      <AvatarImage
                        src={user.profile_image}
                        alt={user.username}
                      />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none">
                        {user.username}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    return (
      <>
        {/* small screen */}
        <div className="lg:hidden ">
          <div>
            <MessagesHeader availableProUsers={availableProUsers} />
          </div>
          {chatRooms.map((chatRoom) => (
            <Conversation key={chatRoom.id} chatRoom={chatRoom} />
          ))}
        </div>

        {/* large screen */}
        <div className="hidden lg:flex flex-col justify-center items-center h-full w-full text-center">
          <h1 className="text-2xl font-semibold">Select a conversation</h1>
          <p className="text-muted-foreground">
            Continue a conversation or start a new one with a Pro user!
          </p>
          <NewChatRoomDialog
            TriggerComponent={
              <Button className="mt-4 font-semibold">
                Start a conversation
              </Button>
            }
            availableProUsers={availableProUsers}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Container className="col-span-full">
        <div className="flex flex-col justify-center items-center">
          <div className="text-center space-y-2 mb-16">
            <h1 className="text-xl lg:text-2xl font-semibold text-primary-blue">
              Ooops, it looks like you are not subscribed to Pro!
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Subscribe to Pro to unlock direct messaging and start connecting
              with people from all over the world!
            </p>
          </div>

          {/* Pro Card */}
          <div className="border p-4 rounded-lg shadow-md max-w-[400px]">
            <div className="mb-8">
              <div className="border rounded-lg bg-primary-blue px-4 w-fit mb-4">
                <p className="text-white font-semibold">PRO</p>
              </div>

              <p className="text-muted-foreground text-sm lg:text-base">
                Subscribe to Pro to unlock direct messaging and start connecting
                with people from all over the world!
              </p>
            </div>

            <h2 className="text-primary-blue text-4xl font-thin">
              $4.99
              <span className="text-sm font-semibold text-green-400 ml-1">
                one-time fee
              </span>
            </h2>

            <hr className="my-4" />

            {/* Features */}
            <ul className="space-y-2">
              {features.map((feature) => (
                <li
                  key={feature.description}
                  className="text-muted-foreground text-sm lg:text-base flex items-center gap-2"
                >
                  <Check className="text-primary-blue" /> {feature.description}
                </li>
              ))}
            </ul>

            <hr className="my-4" />

            <Link
              href="/checkout"
              className="flex items-center justify-center py-1 font-semibold border rounded-lg bg-primary-blue text-white w-full hover:bg-primary-blue/80 transition-colors duration-200"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
