import { HTMLProps } from 'react';
import { cn } from '@froxy/design/utils';
import { Markdown } from '@froxy/react-markdown';
import { useCodeViewContext } from './useCodeViewContext';

type CodeViewerProps = {
  children?: string;
  theme?: 'github-light' | 'github-dark';
} & HTMLProps<HTMLDivElement>;

export function CodeViewer({ children, className, ...props }: CodeViewerProps) {
  const { value, current } = useCodeViewContext();

  return (
    <Markdown
      className={cn('w-full h-full [&>figure]:h-full [&>figure>pre]:h-full rounded-lg shadow-lg m-2', className)}
      markdown={children || value[current].code}
      {...props}
    />
  );
}
