import { useState } from 'react';
import { Button, Heading, Input, Text } from '@froxy/design/components';
import { getRouteApi } from '@tanstack/react-router';
import { IoIosSearch } from 'react-icons/io';

const { useNavigate } = getRouteApi('/(main)/lotus/');

export function LotusSearchBar({ current = '' }: { current?: string }) {
  const [keyword, setKeyword] = useState(current);

  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate({ search: { keyword } });
  };

  return (
    <form className="block md:flex justify-between items-center w-full p-6 bg-white rounded-xl shadow-md mb-10">
      <div className="mb-5 md:mb-0">
        <Heading size="lg" variant="bold" className="pb-1">
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
            className={'pl-9 md:min-w-[21rem]'}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.trim())}
            placeholder="제목을 검색해주세요"
          />
        </div>
        <Button variant={'outline'} className={'px-8 hidden md:block'} onClick={submit}>
          검색하기
        </Button>
      </div>
    </form>
  );
}
