import { useEffect } from 'react';
import { Text } from '@froxy/design/components';
import { Markdown } from '@froxy/react-markdown';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { HistoryType } from '@/feature/history';
import { lotusHistoryQueryOptions } from '@/feature/history/query';

export function SuspenseLotusHistoryDetail({ lotusId, historyId }: { lotusId: string; historyId: string }) {
  const lotusDetailQueryOptions = lotusHistoryQueryOptions.detail({ id: lotusId, historyId });

  const { data } = useSuspenseQuery(lotusDetailQueryOptions);

  const queryClient = useQueryClient();

  // 우선 폴링을 사용하여 데이터를 가져오는 것을 구현해보았습니다.
  useEffect(() => {
    if (data.status !== 'PENDING') return;

    const interval = setInterval(async () => {
      await queryClient.refetchQueries(lotusDetailQueryOptions);

      const updatedData = queryClient.getQueryData<HistoryType>(lotusDetailQueryOptions.queryKey);

      if (!updatedData || updatedData.status === 'PENDING') return;

      queryClient.invalidateQueries(lotusHistoryQueryOptions.list({ id: lotusId }));
    }, 1000);

    return () => clearInterval(interval);
  }, [data, lotusDetailQueryOptions, lotusId, queryClient]);

  const terminal = '```bash\n' + data.output + '\n```';

  if (data.status === 'PENDING') {
    return (
      <div>
        <Text>PENDING...</Text>
      </div>
    );
  }
  return (
    <div>
      <Markdown markdown={terminal} />
    </div>
  );
}
