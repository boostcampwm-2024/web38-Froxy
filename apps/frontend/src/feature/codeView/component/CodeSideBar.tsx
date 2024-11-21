import { HTMLProps } from 'react';
import { Button } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { useCodeViewActionContext, useCodeViewContext } from '@/feature/codeView/hook';

type CodeSideBarProps = HTMLProps<HTMLDivElement>;

export function CodeSideBar({ className, ...props }: CodeSideBarProps) {
  const { value, current } = useCodeViewContext();
  const setCurrentCode = useCodeViewActionContext();

  return (
    <div className={cn('flex flex-col rounded-lg shadow-md py-2 h-full overflow-scroll', className)} {...props}>
      {value.map((v, i) => (
        <Button
          variant={'link'}
          className={cn('flex justify-start', current === i && 'bg-gray-100')}
          key={v.filename}
          onClick={() => setCurrentCode(i)}
        >
          {v.filename}
        </Button>
      ))}
    </div>
  );
}
