import { ComponentProps, HTMLProps, createContext, useContext } from 'react';
import { Heading, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { FormatDateKey, Time } from '@/shared/components/Time';

export interface HistoryType {
  id: string;
  title: string;
  body: string;
  date: Date;
  status: boolean;
}

const HistoryContext = createContext<HistoryType | null>(null);

const useHistoryContext = () => {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error('Component must be used within a HistoryProvider');
  }

  return context;
};

type HistoryProviderProps = {
  children: React.ReactNode;
  value: HistoryType;
};

export function HistoryProvider({ children, value }: HistoryProviderProps) {
  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

type HistoryTitleProps = ComponentProps<typeof Heading>;

export function HistoryTitle({ className, ...props }: HistoryTitleProps) {
  const { title } = useHistoryContext();

  return (
    <Heading size="sm" className={cn('', className)} {...props}>
      {title}
    </Heading>
  );
}

type HistoryBodyProps = ComponentProps<typeof Text>;

export function HistoryBody(props: HistoryBodyProps) {
  const { body } = useHistoryContext();

  return <Text {...props}>{body}</Text>;
}

type HistoryStatusIconProps = { current?: boolean } & HTMLProps<HTMLDivElement>;

export function HistoryStatusIcon({ className, current, ...props }: HistoryStatusIconProps) {
  const { status } = useHistoryContext();

  const color = status ? 'bg-green-500' : 'bg-orange-500';

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
    <Text size="sm" variant="muted" className={cn(className)} {...props}>
      {status ? 'success' : 'error'}
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
  Title: HistoryTitle,
  Body: HistoryBody,
  StatusIcon: HistoryStatusIcon,
  StatusLabel: HistoryStatusLabel,
  Date: HistoryDate
});
