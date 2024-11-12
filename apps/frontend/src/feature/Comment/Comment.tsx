import { HTMLProps, forwardRef } from 'react';
import { cn } from '@froxy/design/utils';
import { Markdown } from '@froxy/react-markdown';

type CommentViewerProps = {
  children?: string;
} & HTMLProps<HTMLDivElement>;

export function CommentViewer({ className, children, ...props }: CommentViewerProps) {
  return <Markdown className={cn('p-4', className)} markdown={children} {...props} />;
}

type CommentEditorProps = {} & HTMLProps<HTMLTextAreaElement>;

export const CommentEditor = forwardRef<HTMLTextAreaElement, CommentEditorProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn('w-full h-full rounded-lg shadow-inner shadow-zinc-200 p-4', className)}
      {...props}
    />
  );
});
