import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@froxy/design/components';
import { HistoryTrigger } from './HistoryTrigger';
import { SuspenseLotusHistoryDetail } from './SuspenseLotusHistoryDetail';
import { useLotusHistoryListSuspenseQuery } from '@/feature/history/query';
import { AsyncBoundary } from '@/shared/boundary';

export function SuspenseLotusHistoryList({ id }: { id: string }) {
  const {
    data: { list }
  } = useLotusHistoryListSuspenseQuery({ id });

  return (
    <div className="flex flex-col gap-5">
      <Accordion type="single">
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
