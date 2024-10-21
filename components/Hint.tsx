import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HintProps {
  children: React.ReactNode;
  description: string;
  className?: string;
  side: 'top' | 'right' | 'bottom' | 'left';
  disabled?: boolean;
}

export const Hint = ({
  children,
  description,
  side,
  className,
  disabled,
}: HintProps) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={5}>
        <TooltipTrigger className={className}>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <p className="text-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
