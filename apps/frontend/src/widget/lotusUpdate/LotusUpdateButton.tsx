import { Button, Text } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { IoSettingsSharp } from 'react-icons/io5';
import { LotusUpdateForm } from './LotusUpdateForm';
import { lotusQueryOptions, useLotusUpdateMutation } from '@/feature/lotus';
import { ModalBox } from '@/shared';
import { useOverlay } from '@/shared/overlay';
import { useToast } from '@/shared/toast';

export function LotusUpdateButton({ lotusId }: { lotusId: string }) {
  const { mutate, isPending } = useLotusUpdateMutation();

  const { open, exit } = useOverlay();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const onSubmit = (body: { title: string; tags: string[] }) => {
    exit();

    mutate(
      { body, id: lotusId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(lotusQueryOptions.detail({ id: lotusId }));

          toast({ description: 'Lotus가 수정되었습니다.', variant: 'success', duration: 2000 });
        },
        onError: () => {
          toast({
            description: 'Lotus 수정 중 오류가 발생했습니다. 다시 시도해 주세요.',
            variant: 'error',
            duration: 2000
          });
        }
      }
    );
  };

  const handleOpenUpdateModal = () => {
    open(() => (
      <ModalBox onClose={exit}>
        <div className="p-6 w-1/2 bg-white rounded-lg">
          <LotusUpdateForm lotusId={lotusId} onSubmit={onSubmit} onCancel={exit} />
        </div>
      </ModalBox>
    ));
  };

  return (
    <Button variant={'default'} onClick={handleOpenUpdateModal} disabled={isPending}>
      <IoSettingsSharp />
      <Text size="sm">수정하기</Text>
    </Button>
  );
}

function SkeletonLotusUpdateButton() {
  return (
    <Button variant={'default'} disabled>
      <IoSettingsSharp />
      <Text size="sm">수정하기</Text>
    </Button>
  );
}

LotusUpdateButton.Skeleton = SkeletonLotusUpdateButton;
