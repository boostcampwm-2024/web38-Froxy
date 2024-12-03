import { ComponentProps, HTMLProps, createContext, useContext } from 'react';
import { Heading, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { HISTORY_STATUS_COLOR } from './constant';
import { HistoryModel } from './model';
import { FormatDateKey, Time } from '@/shared';

const HistoryContext = createContext<HistoryModel | null>(null);

const useHistoryContext = () => {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error('Component must be used within a HistoryProvider');
  }

  return context;
};

type HistoryProviderProps = {
  children: React.ReactNode;
  value: HistoryModel;
};

export function HistoryProvider({ children, value }: HistoryProviderProps) {
  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

type HistoryFilenameProps = ComponentProps<typeof Heading>;

export function HistoryFilename({ className, ...props }: HistoryFilenameProps) {
  const { filename } = useHistoryContext();

  return (
    <Text className={cn('font-semibold', className)} {...props}>
      {filename}
    </Text>
  );
}

type HistoryStatusIconProps = { current?: boolean } & HTMLProps<HTMLDivElement>;

export function HistoryStatusIcon({ className, current, ...props }: HistoryStatusIconProps) {
  const { status } = useHistoryContext();

  const color = HISTORY_STATUS_COLOR[status];

  return (
    <div className={cn('relative flex h-5 w-5', className)} {...props}>
      {current && (
        <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', color)} />
      )}
      <span className={cn('relative inline-flex rounded-full h-full w-full', color)} />
    </div>
  );
}

type HistoryStatusLabelProps = ComponentProps<typeof Text>;

export function HistoryStatusLabel({ className, ...props }: HistoryStatusLabelProps) {
  const { status } = useHistoryContext();

  return (
    <Text size="sm" variant="muted" className={cn(className)} {...props} data-testid="history-status">
      {status.toLocaleLowerCase()}
    </Text>
  );
}

type HistoryDateProps = {
  format?: FormatDateKey;
} & ComponentProps<typeof Text>;

export function HistoryDate({ className, ...props }: HistoryDateProps) {
  const { date } = useHistoryContext();

  return (
    <Text size="sm" variant="muted" className={className} asChild {...props}>
      <Time date={date} format="YYYY.MM.DD." />
    </Text>
  );
}

export const History = Object.assign(HistoryProvider, {
  Filename: HistoryFilename,
  StatusIcon: HistoryStatusIcon,
  StatusLabel: HistoryStatusLabel,
  Date: HistoryDate
});
