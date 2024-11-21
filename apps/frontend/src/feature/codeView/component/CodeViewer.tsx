import { HTMLProps } from 'react';
import { cn } from '@froxy/design/utils';
import { Markdown } from '@froxy/react-markdown';
import { useCodeViewContext } from '@/feature/codeView/hook';

type CodeViewerProps = {
  children?: string;
  theme?: 'github-light' | 'github-dark';
} & HTMLProps<HTMLDivElement>;

const LANGUAGES_EXT = {
  typescript: 'ts',
  ts: 'ts',
  javascript: 'js',
  js: 'js'
} as const;

const getLanguage = (language: string) => {
  return LANGUAGES_EXT[language as keyof typeof LANGUAGES_EXT];
};

// TODO : 아주 막연하게 구현된 컴포넌트, 추후에 스타일 리팩터링 필요
export function CodeViewer({ children, className, ...props }: CodeViewerProps) {
  const { value, current } = useCodeViewContext();

  const language = getLanguage(value[current].language);

  const content = language ? `\`\`\`${language}\n ${value[current].content}\n \`\`\`` : value[current].content;

  return (
    <Markdown
      className={cn(
        'w-full h-full rounded-lg shadow-lg',
        language ? '[&>figure]:h-full [&>figure>pre]:h-full [&>figure>pre]:m-0' : 'p-2',
        'overflow-scroll',
        className
      )}
      markdown={children || content}
      {...props}
    />
  );
}
