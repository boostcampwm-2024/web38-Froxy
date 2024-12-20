import { Switch, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { useQueryClient } from '@tanstack/react-query';
import { LotusDetailModel, useLotusUpdateMutation } from '@/feature/lotus';
import { lotusQueryOptions } from '@/feature/lotus';
import { useDebounce } from '@/shared';

interface SuspenseLotusPublicToggleProps {
  data: LotusDetailModel;
  className?: string;
}

export function SuspenseLotusPublicToggle({ data: { lotus }, className }: SuspenseLotusPublicToggleProps) {
  const { mutate } = useLotusUpdateMutation();

  const queryClient = useQueryClient();

  const lotusDetailOptions = lotusQueryOptions.detail({ id: lotus.id });

  const toggleClick = () => {
    mutate(
      { id: lotus.id, body: { isPublic: !lotus.isPublic } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(lotusDetailOptions);
        }
      }
    );
  };

  const debounceToggleClick = useDebounce(toggleClick, 500);

  //낙관적 업데이트
  const optimisticToggle = () => {
    debounceToggleClick();

    queryClient.setQueryData(lotusDetailOptions.queryKey, (oldData: LotusDetailModel) => {
      const lotus = oldData.lotus.clone({ isPublic: !oldData.lotus.isPublic });

      return {
        ...oldData,
        lotus
      };
    });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Switch checked={lotus.isPublic} onClick={optimisticToggle} />
      <Text size="sm" variant="muted">
        private / public
      </Text>
    </div>
  );
}

function SkeletonSuspenseLotusPublicToggle() {
  return (
    <div className="flex items-center gap-2">
      <Switch disabled />
      <Text size="sm" variant="muted">
        private / public
      </Text>
    </div>
  );
}

SuspenseLotusPublicToggle.Skeleton = SkeletonSuspenseLotusPublicToggle;
