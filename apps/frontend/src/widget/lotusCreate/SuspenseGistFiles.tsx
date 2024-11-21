import { CodeView } from '@/feature/codeView';
import { useUserGistFileSuspenseQuery } from '@/feature/user/query';

import '@/app/style/github.css';

export function SuspenseGistFiles({ gistId }: { gistId: string }) {
  const { data: files } = useUserGistFileSuspenseQuery({ gistId });

  const defaultIndex = files.findIndex(({ filename }) => filename === 'README.md') || 0;

  return (
    <CodeView value={files} current={defaultIndex}>
      <div className="flex github gap-6 w-full h-[600px] mt-20 pb-10 px-2 overflow-hidden">
        <CodeView.SideBar className="h-full min-w-48" />
        <CodeView.Viewer className="block h-full" />
      </div>
    </CodeView>
  );
}
