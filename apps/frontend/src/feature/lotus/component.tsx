import { ComponentProps, HTMLProps, ReactNode, createContext, useContext } from 'react';
import { Badge, Button, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { Link } from '@tanstack/react-router';
import { LotusModel } from '.';
import { BadgeVariantType } from '@/feature/lotus/type';
import { Time } from '@/shared';

const lotusContext = createContext<LotusModel | null>(null);

export const useLotusContext = () => {
  const lotus = useContext(lotusContext);

  if (!lotus) throw new Error('Lotus context is not provided');

  return lotus;
};

type LotusTitleProps = ComponentProps<typeof Text>;

export function LotusTitle(props: LotusTitleProps) {
  const { title } = useLotusContext();

  return (
    <Text size="md" variant="bold" {...props} data-testid="lotus-title">
      {title}
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

type LotusLinkProps = {
  children: React.ReactNode;
  className?: string;
};

export function LotusLink({ children, className }: LotusLinkProps) {
  const { id: lotusId } = useLotusContext();

  return (
    <Link to={'/lotus/$lotusId'} params={{ lotusId }} className={className} data-testid="lotus-link">
      {children}
    </Link>
  );
}

type LotusGistLinkProps = {
  className?: string;
  children?: ReactNode;
};

// a태그 내부에서 사용될 가능성이 높아 Button 컴포넌트로 사용
export function LotusGistLink({ className, children }: LotusGistLinkProps) {
  const { gistUrl } = useLotusContext();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    location.href = gistUrl;
  };

  return (
    <Button variant={null} onClick={handleClick} rel="noreferrer" className={cn('w-7 h-7', className)}>
      {children}
    </Button>
  );
}

export function LotusProvider({ children, lotus }: { children: React.ReactNode; lotus: LotusModel }) {
  return <lotusContext.Provider value={lotus}>{children}</lotusContext.Provider>;
}

export const Lotus = Object.assign(LotusProvider, {
  Title: LotusTitle,
  CreateDate: LotusCreateDate,
  TagList: LotusTagList,
  Link: LotusLink,
  GistLink: LotusGistLink
});
