'use client';

import {
  Globe,
  Globe2,
  HomeIcon,
  MessageSquareIcon,
  Plane,
  SettingsIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Hint } from './Hint';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';

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
  const pathname = usePathname();
  const { user } = useUser();
  if (!user) {
    return (
      <aside className="h-screen bg-moon w-16 lg:w-56 pt-2 flex justify-center">
        <SignUpButton mode="modal">
          <Button variant="link">Sign in</Button>
        </SignUpButton>
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
        <hr className="w-full border-dotted border-gray-300" />
        <div className="flex flex-col items-center lg:items-start pt-2 gap-y-2 w-full">
          {sidebarItems.map((item) => (
            <Hint description={item.label} key={item.label}>
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
