import { Button, Heading } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { Fragment } from 'react/jsx-runtime';
import { History, HistoryType } from '@/feature/History';

type HistoryListProps = {
  children?: React.ReactNode;
  className?: string;
  historyList: HistoryType[];
};

export function HistoryList({ historyList, className }: HistoryListProps) {
  return (
    <div className={cn('shadow-md p-5 rounded-lg w-1/3', className)}>
      <div className="flex items-baseline justify-between mb-2">
        <Heading size="lg">Run History</Heading>
        <Button size={'sm'} variant={'link'}>
          더 보러가기
        </Button>
      </div>
      {historyList.map((history, index) => (
        <Fragment key={index}>
          <History value={history}>
            <div className="flex items-center gap-5 p-3 hover:bg-gray-200 rounded-lg hover:bg-opacity-30 hover:cursor-pointer">
              <History.StatusIcon current={index === 0} />
              <div>
                <History.Filename />
                <div className="flex items-center gap-2">
                  <History.StatusLabel />
                  <span className="text-gray-400"> • </span>
                  <History.Date />
                </div>
              </div>
            </div>
          </History>
        </Fragment>
      ))}
    </div>
  );
}
