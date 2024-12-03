import { Button, Heading, Skeleton, Text } from '@froxy/design/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaGithub } from 'react-icons/fa';
import { LotusLostQueryOptions } from './type';
import { Lotus } from '@/feature/lotus';
import { User } from '@/feature/user';
import { range } from '@/shared';

export function SuspenseLotusList({ queryOptions }: { queryOptions: LotusLostQueryOptions }) {
  const {
    data: { lotuses }
  } = useSuspenseQuery(queryOptions);

  if (lotuses.length < 1) return <SuspenseLotusListEmpty />;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
      {lotuses?.map(({ lotus, author }) => (
        <Lotus lotus={lotus} key={lotus.id}>
          <User user={author}>
            <Lotus.Link>
              <div className="w-full h-full lg:w-82 p-5 shadow-md bg-white rounded-xl hover:shadow-lg hover:shadow-neutral-400 transition-shadow duration-200">
                <div className="flex justify-between items-center">
                  <Lotus.Title className="text-[#1C1D22]" />

                  <Lotus.GistLink className="z-10 rounded-full hover:shadow-md hover:shadow-zinc-400 p-2 transition-shadow duration-300">
                    <FaGithub size={20} />
                  </Lotus.GistLink>
                </div>

                <User.Name className="text-[rgba(28,29,34,0.5)]" />
                <div className="w-full flex justify-between items-end">
                  <Lotus.CreateDate className="text-xs font-bold text-[#888DA7] bg-[rgba(136,141,167,0.1)] px-4 py-2 rounded-3xl" />
                  <User.Avatar />
                </div>
                {!lotus.isTagsEmpty && (
                  <>
                    <div className="mt-4 w-full border-b-2 border-slate-200" />
                    <Lotus.TagList className="pt-4 min-h-8" variant={'default'} />
                  </>
                )}
              </div>
            </Lotus.Link>
          </User>
        </Lotus>
      ))}
    </div>
  );
}

function SuspenseLotusListEmpty() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <DotLottieReact src="/json/emptyHistoryAnimation.json" loop autoplay className="w-102" />
      <Heading className="py-4" size="lg">
        작성된 Lotus가 없습니다.
      </Heading>
      <Text variant="muted">Lotus를 작성해보세요!</Text>
    </div>
  );
}

function SkeletonLotusList() {
  return (
    <div className="w-full grid grid-cols-3 gap-8">
      {range(5).map((value) => (
        <div key={`card_${value}`} className="max-w-96 p-5 border-2 border-slate-200 rounded-xl">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <div className="w-full flex justify-between items-end">
            <Skeleton className="h-4 w-1/4 rounded-3xl" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="mt-4 w-full h-1" />
          <div className="pt-4 min-h-8 space-y-2">
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

SuspenseLotusList.Skeleton = SkeletonLotusList;

interface ErrorProps {
  error: unknown;
  retry: () => void;
  onChangePage: (page?: number) => Promise<void>;
}

function ErrorLotusList({ error, retry, onChangePage }: ErrorProps) {
  const { reset } = useQueryErrorResetBoundary();

  if (axios.isAxiosError(error) && error?.status === 401) throw error;

  const handleRetry = async () => {
    if (axios.isAxiosError(error) && error?.status === 404) {
      await onChangePage(1);
    } else {
      reset();
    }
    retry();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <DotLottieReact src="/json/errorAnimation.json" loop autoplay className="w-96" />
      <Heading className="py-4">Lotus 목록 조회에 실패했습니다</Heading>
      <Button onClick={handleRetry}>재시도</Button>
    </div>
  );
}

SuspenseLotusList.Error = ErrorLotusList;
