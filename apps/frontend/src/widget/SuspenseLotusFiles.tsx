import { CodeView } from '@/feature/CodeView';
import { useLotusSuspenseQuery } from '@/feature/Lotus';

export function SuspenseLotusFiles({ id }: { id: string }) {
  const {
    data: { files }
  } = useLotusSuspenseQuery({ id });

  const readmeIndex = files.findIndex(({ filename }) => filename === 'README.md');

  return (
    <CodeView value={files} current={readmeIndex}>
      <div className="flex github gap-6 w-full h-[600px] pb-10 overflow-hidden">
        <CodeView.SideBar className="h-full min-w-48" />
        <CodeView.Viewer className="block h-[600px]" />
      </div>
    </CodeView>
  );
}
