import { HTMLProps } from 'react';
import { Button } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { useCodeViewActionContext, useCodeViewContext } from './useCodeViewContext';

type CodeSideBarProps = HTMLProps<HTMLDivElement>;

export function CodeSideBar({ className, ...props }: CodeSideBarProps) {
  const { value } = useCodeViewContext();
  const setCurrentCode = useCodeViewActionContext();

  return (
    <div className={cn('flex flex-col rounded-lg shadow-md m-2 py-2 h-full', className)} {...props}>
      {value.map((v, i) => (
        <Button
          variant={'link'}
          className={cn('flex items-start p-1 px-4')}
          key={v.fileName}
          onClick={() => setCurrentCode(i)}
        >
          {v.fileName}
        </Button>
      ))}
    </div>
  );
}
