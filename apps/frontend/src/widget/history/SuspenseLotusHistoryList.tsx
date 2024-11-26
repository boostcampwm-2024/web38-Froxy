import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Heading,
  Skeleton
} from '@froxy/design/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { HistoryTrigger } from './HistoryTrigger';
import { SuspenseLotusHistoryDetail } from './SuspenseLotusHistoryDetail';
import { lotusHistoryQueryOptions } from '@/feature/history/query';
import { range } from '@/shared';
import { AsyncBoundary } from '@/shared/boundary';

export function SuspenseLotusHistoryList({ id, page = 1 }: { id: string; page?: number }) {
  const {
    data: { list }
  } = useSuspenseQuery(lotusHistoryQueryOptions.list({ id, page }));

  const pendingHistoriesId = list.filter((history) => history.status === 'PENDING').map((history) => history.id);

  const firstPageFirstItem = page === 1 ? [list[0]?.id] : [];

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

export function SkeletonLotusHistoryList() {
  return (
    <div className="flex flex-col gap-5 min-h-[700px]">
      {range(5).map((value) => (
        <Skeleton
          key={`history_${value}`}
          className="h-32 rounded-md p-5 px-7 bg-neutral-100 dark:bg-neutral-800 shadow-md"
        />
      ))}
    </div>
  );
}

SuspenseLotusHistoryList.Skeleton = SkeletonLotusHistoryList;

interface ErrorProps {
  error: unknown;
  retry: () => void;
  onChangePage: (page: number) => Promise<void>;
}

function ErrorLotusHistoryList({ error, retry, onChangePage }: ErrorProps) {
  const { reset } = useQueryErrorResetBoundary();

  if (axios.isAxiosError(error) && (error?.status === 401 || error?.status === 403)) throw error;

  const handleRetry = async () => {
    if (axios.isAxiosError(error) && error?.status === 404) {
      await onChangePage(1);
    } else {
      reset();
    }
    retry();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <DotLottieReact src="/json/errorAnimation.json" loop autoplay className="w-96" />
      <Heading className="py-4">History 목록 조회에 실패했습니다</Heading>
      <Button onClick={handleRetry}>재시도</Button>
    </div>
  );
}

SuspenseLotusHistoryList.Error = ErrorLotusHistoryList;
