import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HintProps {
  children: React.ReactNode;
  description: string;
}

export const Hint = ({ children, description }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={5}>
        <TooltipTrigger className="w-full relative">{children}</TooltipTrigger>
        <TooltipContent side="right" className="lg:hidden">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
