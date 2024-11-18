import { createLazyFileRoute } from '@tanstack/react-router';
import { AsyncBoundary } from '@/shared/components/AsyncBoundary';
import { SuspenseLotusHistoryList } from '@/widget/History';
import { CodeRunButton } from '@/widget/LotusCodeInput';
import { SuspenseLotusDetail } from '@/widget/SuspenseLotusDetail';
import { SuspenseLotusFiles } from '@/widget/SuspenseLotusFiles';

import '@/app/style/github.css';

export const Route = createLazyFileRoute('/(main)/lotus/$lotusId/')({
  component: RouteComponent
});

function RouteComponent() {
  const { lotusId: id } = Route.useParams();

  return (
    <div className="flex flex-col gap-16">
      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusDetail id={id} />
      </AsyncBoundary>

      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusFiles id={id} />
      </AsyncBoundary>

      <CodeRunButton lotusId={id} />

      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusHistoryList id={id} />
      </AsyncBoundary>
    </div>
  );
}
