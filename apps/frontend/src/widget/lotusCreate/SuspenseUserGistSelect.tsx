import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Text
} from '@froxy/design/components';
import { useUserGistListSuspenseInfinity } from '@/feature/user/query';
import { range } from '@/shared';

export function SuspenseUserGistSelect({ onValueChange }: { onValueChange: (value: string) => void }) {
  const { data, fetchNextPage, isFetchingNextPage } = useUserGistListSuspenseInfinity();

  return (
    <div>
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="업로드할 Gist를 선택하세요." />
        </SelectTrigger>
        <SelectContent>
          {data?.map((gist) => (
            <SelectItem key={gist.gistId} value={gist.gistId}>
              <Text>{gist.title}</Text>
            </SelectItem>
          ))}

          {isFetchingNextPage && <SkeletonNextPages />}

          <div className="m-2 mt-5">
            <Button
              className="w-full"
              variant={'secondary'}
              type="button"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              + 더보기
            </Button>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

function SkeletonNextPages({ size = 5 }: { size?: number }) {
  return new Array(size).fill(0).map((_, i) => (
    <SelectItem key={i} value={`${i}`} disabled>
      <Text>Loading....</Text>
    </SelectItem>
  ));
}

function SkeletonUserGistSelect() {
  return (
    <div>
      <Select>
        <SelectTrigger disabled>
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
        <SelectContent>
          {range(5).map((value) => (
            <Skeleton key={`gist_${value}`} className="h-10 w-full my-1" />
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

SuspenseUserGistSelect.Skeleton = SkeletonUserGistSelect;
