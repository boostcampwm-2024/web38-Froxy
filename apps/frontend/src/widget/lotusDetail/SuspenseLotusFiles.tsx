import { useSuspenseQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components';
import { CodeFileModel, CodeView } from '@/feature/codeView';
import { lotusQueryOptions } from '@/feature/lotus';

export function SuspenseLotusFiles({ id }: { id: string }) {
  const {
    data: { files }
  } = useSuspenseQuery(lotusQueryOptions.detail({ id }));

  const defaultFile = CodeFileModel.getDefaultFile(files);
  const defaultFileIndex = defaultFile ? files.findIndex((file) => defaultFile?.filename === file.filename) : 0;

  return (
    <CodeView value={files} current={defaultFileIndex}>
      <div className="flex github gap-4 w-full h-[600px] py-5 px-2 overflow-hidden rounded-lg">
        <CodeView.SideBar className="h-full min-w-48 bg-white" />
        <CodeView.Viewer className="block h-full px-2" />
      </div>
    </CodeView>
  );
}

export function LotusFileSkeleton() {
  return (
    <div className="flex github gap-4 w-full h-[600px] pb-10 px-2 overflow-hidden">
      <Skeleton className="h-full min-w-48" />
      <Skeleton className="h-full w-full" />
    </div>
  );
}

SuspenseLotusFiles.Skeleton = LotusFileSkeleton;
