import { Switch, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useLotusUpdateMutation } from '@/feature/Lotus';
import { LotusType } from '@/feature/Lotus/type';
import { useDebounce } from '@/shared/hooks/useDebounce';

export function SuspenseLotusPublicToggle({ lotus, className }: { lotus: LotusType; className?: string }) {
  const { mutate } = useLotusUpdateMutation();
  const queryClient = useQueryClient();

  const toggleClick = () => {
    mutate(
      { id: lotus.id, body: { isPublic: !lotus.isPublic } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['lotus', 'detail', lotus.id] });
        }
      }
    );
  };

  const debounceToggleClick = useDebounce(toggleClick, 500);

  //낙관적 업데이트
  const optimisticToggle = () => {
    debounceToggleClick();
    queryClient.setQueryData(['lotus', 'detail', lotus.id], (oldData: LotusType) => ({
      ...oldData,
      isPublic: !oldData.isPublic
    }));
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
