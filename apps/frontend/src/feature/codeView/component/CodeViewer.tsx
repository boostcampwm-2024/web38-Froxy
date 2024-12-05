import { HTMLProps } from 'react';
import { cn } from '@froxy/design/utils';
import { Markdown } from '@froxy/react-markdown';
import { Text } from '@/components';
import { useCodeViewContext } from '@/feature/codeView/hook';

type CodeViewerProps = {
  children?: string;
  theme?: 'github-light' | 'github-dark';
} & HTMLProps<HTMLDivElement>;

// TODO : 아주 막연하게 구현된 컴포넌트, 추후에 스타일 리팩터링 필요
export function CodeViewer({ className, ...props }: CodeViewerProps) {
  const { value, current } = useCodeViewContext();

  const file = value[current];

  if (!file.canView)
    return (
      <div className={cn('w-full h-full rounded-lg shadow-lg text-sm flex flex-col items-center justify-center')}>
        <img src={'/image/logoIcon.svg'} alt={file.filename} className="w-40 h-40 object-contain" />
        <Text>지원하지 않는 확장자입니다.</Text>
      </div>
    );

  return (
    <Markdown
      className={cn(
        'w-full h-full rounded-lg shadow-lg text-sm bg-[#f6f8fa]',
        file.language
          ? '[&>figure]:h-full [&>figure]:w-full [&>figure>pre]:h-full [&>figure>pre]:w-full [&>figure>pre]:m-0'
          : 'p-2',
        'overflow-scroll',
        className
      )}
      markdown={file.toMarkdown()}
      {...props}
    />
  );
}
