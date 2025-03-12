import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const [height, setHeight] = React.useState('auto');

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const textarea = e.target as HTMLTextAreaElement;
      setHeight('auto');
      setHeight(`${textarea.scrollHeight}px`);
    };

    return (
      <textarea
        className={cn(
          'flex w-full min-h-[60px] rounded-md border border-input bg-transparent px-4 py-6 md:px-4 md:py-6 text-xl md:text-xl shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none',
          className
        )}
        ref={ref}
        {...props}
        style={{ height }}
        onInput={handleInput}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
