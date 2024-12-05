import { useEffect } from 'react';
import { Button, Heading } from '@froxy/design/components';
import { Markdown } from '@froxy/react-markdown';
import { useQueryClient, useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { AiOutlineLoading } from 'react-icons/ai';
import { lotusHistoryQueryOptions } from '@/feature/history/query';

export function SuspenseLotusHistoryDetail({ lotusId, historyId }: { lotusId: string; historyId: string }) {
  const lotusDetailQueryOptions = lotusHistoryQueryOptions.detail({ id: lotusId, historyId });

  const { data } = useSuspenseQuery(lotusDetailQueryOptions);

  const queryClient = useQueryClient();

  // 우선 폴링을 사용하여 데이터를 가져오는 것을 구현해보았습니다.
  useEffect(() => {
    if (data.status !== 'PENDING') return;

    const interval = setInterval(async () => {
      const updatedData = await queryClient.fetchQuery(lotusDetailQueryOptions);

      if (!updatedData || updatedData.status === 'PENDING') return;

      queryClient.invalidateQueries(lotusHistoryQueryOptions.list({ id: lotusId }));
    }, 1000);

    return () => clearInterval(interval);
  }, [data, lotusDetailQueryOptions, lotusId, queryClient]);

  const terminal = '```bash\n' + data.output + '\n```';

  if (data.status === 'PENDING') {
    return <LotusHistoryDetailFallback title="PENDING" />;
  }

  return (
    <div className="terminal">
      <Markdown markdown={terminal} />
    </div>
  );
}

function LotusHistoryDetailFallback({ title }: { title: string }) {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-20 animate-pulse m-2 p-2 bg-[#f6f8fa]">
      <AiOutlineLoading className="animate-spin font-bold text-gray-500" size={40} />
      <Heading variant="muted">{title}</Heading>
    </div>
  );
}

SuspenseLotusHistoryDetail.Fallback = LotusHistoryDetailFallback;

function LotusHistoryDetailError({ retry }: { retry?: () => void }) {
  const { reset } = useQueryErrorResetBoundary();

  const handleClick = () => {
    reset();
    retry?.();
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full min-h-20 m-2 p-2 bg-[#f6f8fa]">
      <div className="flex gap-2 items-center">
        <img src="/image/logoIcon.svg" className="w-8 h-8 rounded-lg" />
        <Heading>OOPS</Heading>
      </div>

      {retry && (
        <Button size={'sm'} onClick={handleClick}>
          재시도
        </Button>
      )}
    </div>
  );
}

SuspenseLotusHistoryDetail.Error = LotusHistoryDetailError;
