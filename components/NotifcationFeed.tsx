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
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const { user, isLoaded } = useUser();

  // Combine all conditions for a single early return
  if (!isLoaded || !user?.id) {
    return null; // Return null instead of undefined
  }

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_KEY!}
      userId={user.id}
    >
      <KnockFeedProvider feedId={process.env.NEXT_PUBLIC_KNOCK_CHANNEL_ID!}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={() => setIsVisible(!isVisible)}
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
