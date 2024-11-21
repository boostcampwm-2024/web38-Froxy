import { CodeView } from '@/feature/codeView';
import { useLotusSuspenseQuery } from '@/feature/lotus';

export function SuspenseLotusFiles({ id }: { id: string }) {
  const {
    data: { files }
  } = useLotusSuspenseQuery({ id });

  const defaultIndex = files.findIndex(({ filename }) => filename === 'README.md');

  return (
    <CodeView value={files} current={defaultIndex}>
      <div className="flex github gap-4 w-full h-[600px] pb-10 px-2 overflow-hidden">
        <CodeView.SideBar className="h-full min-w-48" />
        <CodeView.Viewer className="block h-full" />
      </div>
    </CodeView>
  );
}
