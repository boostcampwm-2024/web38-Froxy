import { useSuspenseQuery } from '@tanstack/react-query';
import { lotusQueryOptions } from '@/feature/lotus';
import { userQueryOptions } from '@/feature/user';
import { LotusDeleteButton } from '@/widget/lotusDelete';
import { LotusUpdateButton, SuspenseLotusPublicToggle } from '@/widget/lotusUpdate';

export function SuspenseLotusEdit({ id }: { id: string }) {
  const { data: user } = useSuspenseQuery(userQueryOptions.info());

  const { data } = useSuspenseQuery(lotusQueryOptions.detail({ id }));

  const { author } = data;

  return (
    user?.id === author.id && (
      <div className="flex items-center gap-2 pt-2">
        <SuspenseLotusPublicToggle data={data} className="mr-5" />
        <LotusUpdateButton lotusId={id} />
        <LotusDeleteButton lotusId={id} />
      </div>
    )
  );
}

function SuspenseLotusEditSkeleton() {
  return (
    <div className="flex items-center gap-2 pt-2">
      <SuspenseLotusPublicToggle.Skeleton />
      <LotusUpdateButton.Skeleton />
      <LotusDeleteButton.Skeleton />
    </div>
  );
}

SuspenseLotusEdit.Skeleton = SuspenseLotusEditSkeleton;

SuspenseLotusEdit.Error = () => <div></div>;
