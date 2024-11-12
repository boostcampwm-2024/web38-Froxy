import { Heading, Text } from '@froxy/design/components';
import { LotusSearch } from '@/feature/LotusSearch';

export function LotusSearchBar() {
  return (
    <div className="flex justify-between items-center w-full p-6 border-2 border-[#E2E8F0] rounded-[0.75rem] shadow-sm">
      <div>
        <Heading size="lg" variant="bold" className="pb-1 text-[#020617]">
          Lotus
        </Heading>
        <Text size="sm" className="text-[#64748B]">
          Lotus는 gist 저장소들을 의미합니다
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <LotusSearch>
          <LotusSearch.SearchInput />
          <LotusSearch.SearchButton />
        </LotusSearch>
      </div>
    </div>
  );
}
