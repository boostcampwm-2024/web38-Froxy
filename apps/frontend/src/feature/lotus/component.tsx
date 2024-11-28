import { ComponentProps, HTMLProps, createContext, useContext } from 'react';
import { Badge, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { Link } from '@tanstack/react-router';
import { FaGithub } from 'react-icons/fa';
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
    <Text size="md" variant="bold" {...props}>
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
    <Link to={'/lotus/$lotusId'} params={{ lotusId }} className={className}>
      {children}
    </Link>
  );
}

type LotusGistLinkProps = {
  className?: string;
  size?: number;
};

export function LotusGistLink({ className, size }: LotusGistLinkProps) {
  const { gistUrl } = useLotusContext();

  return (
    <a href={gistUrl} target="_blank" rel="noreferrer" className={className}>
      <FaGithub size={size} />
    </a>
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
