import { Slot, SlotComponentProps } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';

export const formatDate = {
  day: (date: Date, locales: Intl.LocalesArgument) => date.toLocaleDateString(locales, { weekday: 'long' }),
  'YYYY.MM.DD.': (date: Date, locales: Intl.LocalesArgument) => date.toLocaleDateString(locales).split('T')[0],
  'YYYY-MM-DD': (date: Date, locales: Intl.LocalesArgument) =>
    date.toLocaleDateString(locales).slice(0, 11).replaceAll('. ', '-')
} as const;

export type FormatDateKey = keyof typeof formatDate;

export interface TimeProps<T> extends SlotComponentProps<T> {
  date: Date;
  format?: FormatDateKey;
  locale?: Intl.LocalesArgument;
}

export const Time = <T extends HTMLElement = HTMLSpanElement>({
  date,
  format = 'YYYY.MM.DD.',
  locale = 'ko-KR',
  className,
  asChild,
  ...props
}: TimeProps<T>) => {
  const tw = cn('text-gray-600', className);

  const Element = asChild ? Slot : 'span';

  return (
    <Element className={tw} {...props}>
      {formatDate[format](date, locale)}
    </Element>
  );
};
