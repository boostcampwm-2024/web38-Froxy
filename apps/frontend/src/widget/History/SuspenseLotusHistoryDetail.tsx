import { useEffect } from 'react';
import { Text } from '@froxy/design/components';
import { Markdown } from '@froxy/react-markdown';
import { useQueryClient } from '@tanstack/react-query';
import { HistoryType } from '@/feature/History';
import { useLotusHistorySuspenseQuery } from '@/feature/History/query';

export function SuspenseLotusHistoryDetail({ lotusId, historyId }: { lotusId: string; historyId: string }) {
  const { data } = useLotusHistorySuspenseQuery({ lotusId, historyId });

  const queryClient = useQueryClient();

  // 우선 폴링을 사용하여 데이터를 가져오는 것을 구현해보았습니다.
  useEffect(() => {
    if (data.status !== 'PENDING') return;

    const interval = setInterval(() => {
      queryClient
        .refetchQueries({
          queryKey: ['lotus', 'detail', lotusId, 'history', historyId]
        })
        .then(() => {
          const updatedData = queryClient.getQueryData<HistoryType>(['lotus', 'detail', lotusId, 'history', historyId]);

          if (updatedData && updatedData.status !== 'PENDING') {
            queryClient.invalidateQueries({
              queryKey: ['lotus', 'detail', lotusId, 'history']
            });
          }
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

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
