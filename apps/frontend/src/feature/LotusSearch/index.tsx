import { ComponentProps, HTMLProps, createContext, useContext, useState } from 'react';
import { Button, Input } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { IoIosSearch } from 'react-icons/io';

interface LotusSearchType {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onClickSearchLotus: (searchValue: string) => void;
}

const lotusSearchContext = createContext<LotusSearchType | null>(null);

export const useLotusSearchContext = () => {
  const lotus = useContext(lotusSearchContext);

  if (!lotus) throw new Error('Lotus Search context is not provided');

  return lotus;
};

type LotusSearchInputProps = HTMLProps<HTMLInputElement>;

export function LotusSearchInput({ className, ...props }: LotusSearchInputProps) {
  const { search, setSearch, onClickSearchLotus } = useLotusSearchContext();

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onClickSearchLotus(search);
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-3 text-muted-foreground">
        <IoIosSearch />
      </div>
      <Input
        className={cn('pl-9 min-w-[21rem]', className)}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        {...props}
        placeholder="제목 및 태그를 검색해주세요"
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

type LotusSearchButtonProps = ComponentProps<typeof Button>;

export function LotusSearchButton({ className, ...props }: LotusSearchButtonProps) {
  const { search, onClickSearchLotus } = useLotusSearchContext();

  return (
    <Button variant={'outline'} className={cn('px-8', className)} onClick={() => onClickSearchLotus(search)} {...props}>
      검색하기
    </Button>
  );
}

export function LotusSearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState('');

  const onClickSearchLotus = (searchValue: string) => {
    if (!searchValue) return;

    // TODO: queryClient.invalidateQueries 새로운 검색어로 검색 수행
    console.log('검색!: ', searchValue);
  };

  return (
    <lotusSearchContext.Provider value={{ search, setSearch, onClickSearchLotus }}>
      {children}
    </lotusSearchContext.Provider>
  );
}

export const LotusSearch = Object.assign(LotusSearchProvider, {
  SearchInput: LotusSearchInput,
  SearchButton: LotusSearchButton
});
