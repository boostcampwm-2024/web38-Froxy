import { Skeleton } from '@froxy/design/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FaGithub } from 'react-icons/fa';
import { Lotus } from '@/feature/lotus';
import { lotusQueryOptions } from '@/feature/lotus';
import { User } from '@/feature/user';

export function SuspenseLotusDetail({ id }: { id: string }) {
  const { data } = useSuspenseQuery(lotusQueryOptions.detail({ id }));

  const { lotus, author } = data;

  return (
    <div>
      <Lotus lotus={lotus}>
        <User user={author}>
          <div className="mb-4">
            <div className="flex items-center gap-5 mr-10">
              <Lotus.Title className="text-3xl font-bold" />
              <Lotus.GistLink className="rounded-full p-2 shadow-md hover:shadow-zinc-500 transition-shadow duration-300">
                <FaGithub size={20} />
              </Lotus.GistLink>
            </div>
            <div>{!lotus.isTagsEmpty && <Lotus.TagList className="pt-4 min-h-8" variant={'default'} />}</div>
          </div>
          <User.Name className="text-[rgba(28,29,34,0.5)]" />
          <Lotus.CreateDate className="text-xs text-[rgba(28,29,34,0.5)]" />
        </User>
      </Lotus>
    </div>
  );
}

function SkeletonLotusDetail() {
  return (
    <div className="flex justify-between items-start pb-4 border-slate-200">
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
    </div>
  );
}

SuspenseLotusDetail.Skeleton = SkeletonLotusDetail;
