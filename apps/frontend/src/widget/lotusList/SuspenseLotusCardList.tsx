import { Skeleton } from '@froxy/design/components';
import { Lotus, useLotusListSuspenseQuery } from '@/feature/lotus';
import { range } from '@/shared';

export function SuspenseLotusList({ page = 1 }: { page?: number }) {
  const { data: lotusList } = useLotusListSuspenseQuery({ page });

  return (
    <div className="w-full grid grid-cols-3 gap-8">
      {lotusList?.lotuses?.map((lotus) => (
        <Lotus lotus={lotus} key={lotus.id}>
          <Lotus.Link className="max-w-96 p-5 border-2 border-slate-200 rounded-xl">
            <Lotus.Title className="text-[#1C1D22]" />
            <Lotus.Author className="text-[rgba(28,29,34,0.5)]" />
            <div className="w-full flex justify-between items-end">
              <Lotus.CreateDate className="text-xs font-bold text-[#888DA7] bg-[rgba(136,141,167,0.1)] px-4 py-2 rounded-3xl" />
              <Lotus.Logo />
            </div>
            {lotus?.tags?.length ? (
              <>
                <div className="mt-4 w-full border-b-2 border-slate-200" />
                <Lotus.TagList className="pt-4 min-h-8" variant={'default'} />
              </>
            ) : (
              <></>
            )}
          </Lotus.Link>
        </Lotus>
      ))}
    </div>
  );
}

function SkeletonLotusCardList() {
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

SuspenseLotusList.Skeleton = SkeletonLotusCardList;
