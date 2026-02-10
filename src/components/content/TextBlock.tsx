import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/utils';

interface TextBlockProps {
  content: string;
  className?: string;
}

export function TextBlock({ content, className }: TextBlockProps) {
  return (
    <div className={cn(className)}>
      <MarkdownRenderer content={content} />
    </div>
  );
}
