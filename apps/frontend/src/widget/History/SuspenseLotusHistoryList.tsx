import { Text } from '@froxy/design/components';
import { History } from '@/feature/History';
import { useLotusHistoryListSuspenseQuery } from '@/feature/History/query';

export function SuspenseLotusHistoryList({ id }: { id: string }) {
  const {
    data: { list }
  } = useLotusHistoryListSuspenseQuery({ id });

  return (
    <div className="flex flex-col gap-5">
      {list.map((history, i) => (
        <div
          key={history.date.toISOString() + i}
          className="flex items-center shadow-zinc-300 shadow-md rounded-md p-5 px-7 gap-7"
        >
          <History value={history}>
            <History.StatusIcon className="w-7 h-7" current={history.status === 'PENDING'} />
            <div className="flex flex-col gap-2">
              <History.Filename />

              <div className="flex gap-2">
                <History.StatusLabel />
                <Text size="sm" variant="muted">
                  {'•'}
                </Text>
                <History.Date />
              </div>
            </div>
          </History>
        </div>
      ))}
    </div>
  );
}
