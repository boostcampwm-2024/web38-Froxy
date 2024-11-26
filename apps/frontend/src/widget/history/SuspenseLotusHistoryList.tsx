import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@froxy/design/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { HistoryTrigger } from './HistoryTrigger';
import { SuspenseLotusHistoryDetail } from './SuspenseLotusHistoryDetail';
import { lotusHistoryQueryOptions } from '@/feature/history/query';
import { AsyncBoundary } from '@/shared/boundary';

export function SuspenseLotusHistoryList({ id, page = 1 }: { id: string; page?: number }) {
  const {
    data: { list }
  } = useSuspenseQuery(lotusHistoryQueryOptions.list({ id, page }));

  const pendingHistoriesId = list.filter((history) => history.status === 'PENDING').map((history) => history.id);

  const firstPageFirstItem = page === 1 ? [list[0].id] : [];

  return (
    <div className="flex flex-col gap-5 min-h-[700px]">
      {/* NOTE : key를 이용해 갱신해야 Pending 상태인 Content 고정 가능 */}
      <Accordion
        key={new Date().getTime()}
        type="multiple"
        defaultValue={[...firstPageFirstItem, ...pendingHistoriesId]}
      >
        {list.map((history) => (
          <AccordionItem
            key={history.id}
            className="shadow-zinc-300 shadow-md rounded-md p-5 px-7 gap-7"
            value={history.id}
          >
            <AccordionTrigger value={history.id} disabled={history.status === 'PENDING'}>
              <HistoryTrigger history={history} />
            </AccordionTrigger>
            <AccordionContent>
              <AsyncBoundary
                pending={<SuspenseLotusHistoryDetail.Fallback title="LOADING" />}
                rejected={({ retry }) => <SuspenseLotusHistoryDetail.Error retry={retry} />}
              >
                <SuspenseLotusHistoryDetail lotusId={id} historyId={history.id} />
              </AsyncBoundary>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
