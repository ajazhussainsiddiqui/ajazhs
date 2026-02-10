"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';


interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}
      components={{
        h1: ({node, ...props}) => <h1 className="font-headline text-2xl md:text-4xl font-bold mb-4 last:mb-0 tracking-tight" {...props} />,
        h2: ({node, ...props}) => <h2 className="font-headline text-xl md:text-3xl font-bold mb-3 mt-6 last:mb-0 tracking-tight" {...props} />,
        h3: ({node, ...props}) => <h3 className="font-headline text-lg md:text-2xl font-bold mb-2 mt-4 last:mb-0 tracking-tight" {...props} />,
        p: ({node, ...props}) => <p className="text-base leading-relaxed mb-4 last:mb-0" {...props} />,
        a: ({node, ...props}) => (
          <a 
            className="text-primary hover:underline underline-offset-4 transition-all inline-block" 
            {...props} 
          />
        ),
        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 last:mb-0" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 last:mb-0" {...props} />,
        li: ({node, ...props}) => <li className="mb-1" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}