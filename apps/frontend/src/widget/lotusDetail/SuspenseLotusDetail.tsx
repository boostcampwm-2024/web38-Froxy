import { Skeleton } from '@froxy/design/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Lotus } from '@/feature/lotus';
import { lotusQueryOptions } from '@/feature/lotus';
import { User, userQueryOptions } from '@/feature/user';
import { LotusDeleteButton } from '@/widget/lotusDelete';
import { LotusUpdateButton, SuspenseLotusPublicToggle } from '@/widget/lotusUpdate';

export function SuspenseLotusDetail({ id }: { id: string }) {
  const { data: user } = useSuspenseQuery(userQueryOptions.info());

  const { data } = useSuspenseQuery(lotusQueryOptions.detail({ id }));

  const { lotus, author } = data;

  return (
    <div className="flex justify-between items-start pb-4 border-b-2 border-slate-200">
      <div>
        <Lotus lotus={lotus}>
          <User user={author}>
            <div className="mb-4">
              <Lotus.Title className="text-3xl font-bold mr-4" />
              <div>{!lotus.isTagsEmpty && <Lotus.TagList className="pt-4 min-h-8" variant={'default'} />}</div>
            </div>
            <User.Name className="text-[rgba(28,29,34,0.5)]" />
            <Lotus.CreateDate className="text-xs text-[rgba(28,29,34,0.5)]" />
          </User>
        </Lotus>
      </div>
      {user?.id === author.id && (
        <div className="flex items-center gap-2 pt-2">
          <SuspenseLotusPublicToggle data={data} className="mr-5" />
          <LotusUpdateButton lotusId={id} />
          <LotusDeleteButton lotusId={id} />
        </div>
      )}
    </div>
  );
}

function SkeletonLotusDetail() {
  return (
    <div className="flex justify-between items-start pb-4 border-b-2 border-slate-200">
      <div>
        <div className="mb-4">
          <Skeleton className="font-bold mr-4 w-32 h-10" />
        </div>
        <div className="flex gap-2 mb-4">
          {new Array(3).fill(0).map((_, index) => (
            <Skeleton key={index} className="w-10 h-6 rounded-sm" />
          ))}
        </div>
        <Skeleton className="w-18 h-6 my-2" />
        <Skeleton className="w-10 h-4" />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <SuspenseLotusPublicToggle.Skeleton />
        <LotusUpdateButton.Skeleton />
        <LotusDeleteButton.Skeleton />
      </div>
    </div>
  );
}

SuspenseLotusDetail.Skeleton = SkeletonLotusDetail;
