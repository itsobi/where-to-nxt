'use client';

import {
  HomeIcon,
  Loader,
  MessageSquareIcon,
  SettingsIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Hint } from './Hint';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import Image from 'next/image';
import { DottedSeparator } from './DottedSeparator';
import { useMediaQuery } from '@/lib/useMediaQuery';

const sidebarItems = [
  {
    label: 'Home',
    icon: <HomeIcon />,
    href: '/',
  },
  {
    label: 'Messages',
    icon: <MessageSquareIcon />,
    href: '/messages',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    href: '/settings',
  },
];

export function Sidebar() {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const pathname = usePathname();
  const { user } = useUser();
  if (!user) {
    return (
      <aside className="h-screen px-4 bg-moon w-16 lg:w-56 pt-2 flex flex-col items-center">
        <div className="flex items-center gap-x-2 py-2 text-primary-blue">
          <Image src="/logo.svg" alt="Where To NXT?" width={40} height={100} />
          <h4 className="hidden lg:flex text-lg font-semibold">
            Where To NXT?
          </h4>
        </div>
        <DottedSeparator />
        <div className="mt-2">
          <ClerkLoading>
            <Loader className="animate-spin text-primary-blue" />
          </ClerkLoading>
        </div>
        <ClerkLoaded>
          <SignInButton mode="modal">
            <Button variant="link">Sign in</Button>
          </SignInButton>
        </ClerkLoaded>

        <footer className="py-4 hidden lg:block text-xs text-muted-foreground absolute bottom-0">
          <p>
            brought to you by:{' '}
            <a
              href="https://justobii.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-blue hover:underline"
            >
              justobii.com
            </a>
          </p>
        </footer>
      </aside>
    );
  } else {
    return (
      <aside className="h-screen bg-moon w-16 lg:w-56 flex flex-col items-center px-4 overflow-hidden relative">
        <div className="flex items-center gap-x-2 py-2 text-primary-blue">
          <Image src="/logo.svg" alt="Where To NXT?" width={40} height={100} />
          <h4 className="hidden lg:flex text-lg font-semibold">
            Where To NXT?
          </h4>
        </div>
        <DottedSeparator />
        <div className="flex flex-col items-center lg:items-start pt-2 gap-y-2 w-full">
          {sidebarItems.map((item) => (
            <Hint
              description={item.label}
              key={item.label}
              side="right"
              className="w-full"
              disabled={isLargeScreen}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center justify-center lg:justify-start p-2 gap-x-2 text-muted-foreground transition-all duration-300 hover:text-primary-blue lg:hover:text-white lg:hover:bg-primary-blue/90 rounded-full lg:w-full',
                  (pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href))) &&
                    'text-primary-blue'
                )}
              >
                <span>{item.icon}</span>
                <p className="hidden lg:block">{item.label}</p>
              </Link>
            </Hint>
          ))}
          <div className="mt-10 lg:px-2">
            <div className="lg:hidden">
              <UserButton />
            </div>
            <div className="hidden lg:block w-full">
              <UserButton
                showName
                appearance={{
                  elements: {
                    avatarBox: '',
                    userButtonBox: 'flex flex-row-reverse items-center',
                    userButtonOuterIdentifier: 'font-semibold',
                  },
                }}
              />
            </div>
          </div>
        </div>

        <footer className="py-4 hidden lg:block text-xs text-muted-foreground absolute bottom-0">
          <p>
            brought to you by:{' '}
            <a
              href="https://justobii.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-blue hover:underline"
            >
              justobii.com
            </a>
          </p>
        </footer>
      </aside>
    );
  }
}
