import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@froxy/design/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { HistoryTrigger } from './HistoryTrigger';
import { SuspenseLotusHistoryDetail } from './SuspenseLotusHistoryDetail';
import { lotusHistoryQueryOptions } from '@/feature/history/query';
import { AsyncBoundary } from '@/shared/boundary';

export function SuspenseLotusHistoryList({ id }: { id: string }) {
  const {
    data: { list }
  } = useSuspenseQuery(lotusHistoryQueryOptions.list({ id }));

  const firstPendingIndex = list.findIndex((history) => history.status === 'PENDING');

  return (
    <div className="flex flex-col gap-5">
      <Accordion type="single" defaultValue={list[firstPendingIndex]?.id}>
        {list.map((history) => (
          <AccordionItem
            key={history.id}
            className="shadow-zinc-300 shadow-md rounded-md p-5 px-7 gap-7"
            value={history.id}
          >
            <AccordionTrigger className="">
              <HistoryTrigger history={history} />
            </AccordionTrigger>
            <AccordionContent>
              <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!!</div>}>
                <SuspenseLotusHistoryDetail lotusId={id} historyId={history.id} />
              </AsyncBoundary>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
