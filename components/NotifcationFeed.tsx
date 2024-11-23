'use client';

import { useState, useRef } from 'react';
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from '@knocklabs/react';

// Required CSS import, unless you're overriding the styling
import '@knocklabs/react/dist/index.css';
import { useUser } from '@clerk/nextjs';

export const NotificationFeed = () => {
  if (!process.env.NEXT_PUBLIC_KNOCK_PUBLIC_KEY) {
    return;
  }

  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const { user } = useUser();

  if (!user?.id) {
    return;
  }

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_KEY}
      userId={user.id}
    >
      <KnockFeedProvider feedId={'new-comment'}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};
