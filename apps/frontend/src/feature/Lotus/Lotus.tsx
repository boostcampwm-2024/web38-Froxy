import { ComponentProps, HTMLProps, createContext, useContext } from 'react';
import { Badge, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { BadgeVariantType, LotusType } from '@/feature/Lotus/type';
import { Time } from '@/shared/components/Time';

const lotusContext = createContext<LotusType | null>(null);

export const useLotusContext = () => {
  const lotus = useContext(lotusContext);

  if (!lotus) throw new Error('Lotus context is not provided');

  return lotus;
};

type LotusTitleProps = ComponentProps<typeof Text>;

export function LotusTitle(props: LotusTitleProps) {
  const { title } = useLotusContext();

  return (
    <Text size="md" variant="bold" {...props}>
      {title}
    </Text>
  );
}

type LotusAuthorProps = ComponentProps<typeof Text>;

export function LotusAuthor(props: LotusAuthorProps) {
  const { author } = useLotusContext();

  // TODO: 해당 사용자의 마이페이지로 이동하기
  return (
    <Text size="md" {...props}>
      {author.nickname}
    </Text>
  );
}

type LotusTagListProps = HTMLProps<HTMLDivElement> & {
  variant?: BadgeVariantType;
};

export function LotusTagList({ className, variant = 'default', ...props }: LotusTagListProps) {
  const { tags } = useLotusContext();

  return (
    <div className={cn('flex flex-wrap items-center gap-[0.5rem]', className)} {...props}>
      {tags.map((tag, index) => (
        <Badge key={`${index}_${tag}`} className="mb-[0.25rem] text-xs" variant={variant}>
          {tag}
        </Badge>
      ))}
    </div>
  );
}

type LotusCreateDateProps = HTMLProps<HTMLParagraphElement>;

export function LotusCreateDate(props: LotusCreateDateProps) {
  const { date } = useLotusContext();

  return <Time date={date} format="YYYY-MM-DD" {...props} />;
}

type LotusLinkProps = HTMLProps<HTMLAnchorElement>;

export function LotusLink({ children, ...props }: LotusLinkProps) {
  const { link } = useLotusContext();

  return (
    <a {...props} href={`/publicLotus/${link}`}>
      {children}
    </a>
  );
}

type LotusLogoProps = HTMLProps<HTMLImageElement>;

export function LotusLogo({ className, ...props }: LotusLogoProps) {
  const { logo, title } = useLotusContext();

  return <img src={logo} alt={title} className={cn('w-16 h-16 rounded-full', className)} {...props} />;
}

export function LotusProvider({ children, lotus }: { children: React.ReactNode; lotus: LotusType }) {
  return <lotusContext.Provider value={lotus}>{children}</lotusContext.Provider>;
}
