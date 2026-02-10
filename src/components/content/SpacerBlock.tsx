import { cn } from '@/lib/utils';

interface SpacerBlockProps {
  height: number;
  className?: string;
}

export function SpacerBlock({ height, className }: SpacerBlockProps) {
  return (
    <div 
      style={{ height: `${height}px` }} 
      className={cn(className)} 
    />
  );
}
