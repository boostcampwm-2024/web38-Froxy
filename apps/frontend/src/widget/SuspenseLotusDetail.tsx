import { LotusDeleteButton } from './LotusDeleteButton';
import { LotusUpdateButton } from './LotusUpdateButton';
import { SuspenseLotusPublicToggle } from './SuspenseLotusPublicToggle';
import { Lotus, useLotusSuspenseQuery } from '@/feature/Lotus';

export function SuspenseLotusDetail({ id }: { id: string }) {
  const { data: lotus } = useLotusSuspenseQuery({ id });

  return (
    <div className="flex justify-between items-start pb-4 border-b-2 border-slate-200">
      <div>
        <Lotus lotus={lotus}>
          <div className=" mb-4">
            <Lotus.Title className="text-3xl font-bold mr-4" />
            <div>{lotus?.tags?.length > 0 && <Lotus.TagList className="pt-4 min-h-8" variant={'default'} />}</div>
          </div>
          <Lotus.Author className="text-[rgba(28,29,34,0.5)]" />
          <Lotus.CreateDate className="text-xs text-[rgba(28,29,34,0.5)]" />
        </Lotus>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <SuspenseLotusPublicToggle lotus={lotus} className="mr-5" />
        <LotusUpdateButton lotusId={id} />
        <LotusDeleteButton lotusId={id} />
      </div>
    </div>
  );
}
