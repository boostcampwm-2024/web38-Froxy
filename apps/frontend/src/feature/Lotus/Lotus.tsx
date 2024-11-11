import { HTMLProps, createContext, useContext } from 'react';
import { cn } from '@froxy/design/utils';
import { LotusType } from '@/feature/Lotus/type';

const lotusContext = createContext<LotusType | null>(null);

export const useLotusContext = () => {
  const lotus = useContext(lotusContext);

  if (!lotus) throw new Error('Lotus context is not provided');

  return lotus;
};

type LotusTitleProps = HTMLProps<HTMLHeadingElement>;

export function LotusTitle(props: LotusTitleProps) {
  const { title } = useLotusContext();

  return <h1 {...props}>{title}</h1>;
}

type LotusAuthorProps = HTMLProps<HTMLParagraphElement>;

export function LotusAuthor(props: LotusAuthorProps) {
  const { author } = useLotusContext();

  return <p {...props}>{author.nickname}</p>;
}

type LotusCreateDateProps = HTMLProps<HTMLParagraphElement>;

export function LotusCreateDate(props: LotusCreateDateProps) {
  const { date } = useLotusContext();

  return <p {...props}>{date.toISOString()}</p>;
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

  return <img src={logo} alt={title} className={cn('w-20 h-20 rounded-full', className)} {...props} />;
}

export function LotusProvider({ children, lotus }: { children: React.ReactNode; lotus: LotusType }) {
  return <lotusContext.Provider value={lotus}>{children}</lotusContext.Provider>;
}
