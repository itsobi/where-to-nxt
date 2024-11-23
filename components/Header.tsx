import { NotificationFeed } from './NotifcationFeed';

export function Header() {
  return (
    <div className="col-span-full lg:col-span-5 flex items-center justify-end pt-2">
      <NotificationFeed />
    </div>
  );
}
