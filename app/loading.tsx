import { Container } from '@/components/Container';

export default function LoadingScreen() {
  return (
    <Container className="col-span-full">
      <div className="h-full flex flex-col items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-primary-blue rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-primary-blue rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-primary-blue rounded-full animate-bounce"></div>
        </div>
      </div>
    </Container>
  );
}
