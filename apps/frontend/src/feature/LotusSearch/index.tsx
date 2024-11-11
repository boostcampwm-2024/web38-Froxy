import { HTMLProps, createContext, useContext } from 'react';
import { Input } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { IoIosSearch } from 'react-icons/io';

const lotusSearchContext = createContext<null>(null);

export const useLotusSearchContext = () => {
  const lotus = useContext(lotusSearchContext);

  if (!lotus) throw new Error('Lotus Search context is not provided');

  return lotus;
};

type LotusLinkProps = HTMLProps<HTMLInputElement>;

export function LotusSearchInput({ className, ...props }: LotusLinkProps) {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-3 text-muted-foreground">
        <IoIosSearch />
      </div>
      <Input className={cn('pl-9 min-w-[21rem]', className)} {...props} placeholder="제목 및 태그를 검색해주세요" />
    </div>
  );
}

export function LotusSearchProvider({ children }: { children: React.ReactNode }) {
  return <lotusSearchContext.Provider value={null}>{children}</lotusSearchContext.Provider>;
}

export const LotusSearch = Object.assign(LotusSearchProvider, {
  SearchInput: LotusSearchInput
});
