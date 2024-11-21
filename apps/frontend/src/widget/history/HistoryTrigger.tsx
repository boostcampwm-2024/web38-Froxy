import { Text } from '@froxy/design/components';
import { History, HistoryType } from '@/feature/history';

export function HistoryTrigger({ history }: { history: HistoryType }) {
  return (
    <History value={history}>
      <div className="flex gap-7 items-center">
        <History.StatusIcon className="w-7 h-7" current={history.status === 'PENDING'} />
        <div className="flex flex-col items-start gap-2">
          <History.Filename />
          <div className="flex gap-2">
            <History.StatusLabel />
            <Text size="sm" variant="muted">
              {'•'}
            </Text>
            <History.Date />
          </div>
        </div>
      </div>
    </History>
  );
}
