import { LoadingAnimation } from '@/components/LoadingAnimation';

export default function MessagesLoadingScreen() {
  return (
    <div className="col-span-full h-full">
      <LoadingAnimation />
    </div>
  );
}
