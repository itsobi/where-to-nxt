import { Button } from '@/components/ui/button';
import { MailPlus } from 'lucide-react';
import { User } from '@/lib/queries/getProUser';
import { NewChatRoomDialog } from './NewChatRoomDialog';

interface MessagesHeaderProps {
  availableProUsers: User[];
}

export function MessagesHeader({ availableProUsers }: MessagesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-xl font-semibold">Messages</h4>
      <NewChatRoomDialog
        TriggerComponent={
          <Button variant="outline">
            <MailPlus />
          </Button>
        }
        availableProUsers={availableProUsers}
      />
    </div>
  );
}