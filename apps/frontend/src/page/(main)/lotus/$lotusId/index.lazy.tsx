import { createLazyFileRoute } from '@tanstack/react-router';
import { AsyncBoundary } from '@/shared/boundary';
import { SuspenseLotusHistoryList } from '@/widget/history';
import { CodeRunButton } from '@/widget/lotusCodeRun';
import { SuspenseLotusDetail } from '@/widget/lotusDetail';
import { SuspenseLotusFiles } from '@/widget/lotusDetail/SuspenseLotusFiles';

import '@/app/style/github.css';

export const Route = createLazyFileRoute('/(main)/lotus/$lotusId/')({
  component: RouteComponent
});

function RouteComponent() {
  const { lotusId: id } = Route.useParams();

  return (
    <div className="flex flex-col gap-16">
      <AsyncBoundary pending={<SuspenseLotusDetail.Skeleton />} rejected={() => <div>Error!</div>}>
        <SuspenseLotusDetail id={id} />
      </AsyncBoundary>

      <AsyncBoundary pending={<SuspenseLotusFiles.Skeleton />} rejected={() => <div>Error!</div>}>
        <SuspenseLotusFiles id={id} />
      </AsyncBoundary>

      <CodeRunButton lotusId={id} />

      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusHistoryList id={id} />
      </AsyncBoundary>
    </div>
  );
}
