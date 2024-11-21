import { CodeView } from '@/feature/codeView';
import { useUserGistFileSuspenseQuery } from '@/feature/user/query';

export function SuspenseGistFiles({ gistId }: { gistId: string }) {
  const { data: files } = useUserGistFileSuspenseQuery({ gistId });

  const readmeIndex = files.findIndex(({ filename }) => filename === 'README.md');

  return (
    <CodeView value={files} current={readmeIndex}>
      <div className="flex github gap-6 w-full h-[600px] mt-20 pb-10 overflow-hidden">
        <CodeView.SideBar className="h-full min-w-48" />
        <CodeView.Viewer className="block h-[600px]" />
      </div>
    </CodeView>
  );
}
