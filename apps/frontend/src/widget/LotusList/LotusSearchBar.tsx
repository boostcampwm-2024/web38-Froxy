import { Button, Heading, Input, Text } from '@froxy/design/components';
import { IoIosSearch } from 'react-icons/io';
import { useLotusSearch } from '@/feature/LotusSearch/useLotusSearch';

export function LotusSearchBar() {
  const { search, onChangeSearch, onClickSearchLotus, onSearchInputKeyDown } = useLotusSearch();

  return (
    <div className="flex justify-between items-center w-full p-6 border-2 border-[#E2E8F0] rounded-[0.75rem] shadow-sm">
      <div>
        <Heading size="lg" variant="bold" className="pb-1 text-[#020617]">
          Lotus
        </Heading>
        <Text size="sm" variant="muted">
          Lotus는 gist 저장소들을 의미합니다
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 text-muted-foreground">
            <IoIosSearch />
          </div>
          <Input
            className={'pl-9 min-w-[21rem]'}
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="제목 및 태그를 검색해주세요"
            onKeyDown={(e) => onSearchInputKeyDown(e, search)}
          />
        </div>
        <Button variant={'outline'} className={'px-8'} onClick={() => onClickSearchLotus(search)}>
          검색하기
        </Button>
      </div>
    </div>
  );
}
