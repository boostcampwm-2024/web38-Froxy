import { Button, Text } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { IoSettingsSharp } from 'react-icons/io5';
import { LotusUpdateForm } from './LotusUpdateForm';
import { useLotusUpdateMutation } from '@/feature/lotus';
import { ModalBox } from '@/shared';
import { useOverlay } from '@/shared/overlay';

export function LotusUpdateButton({ lotusId }: { lotusId: string }) {
  const { mutate } = useLotusUpdateMutation();

  const { open, exit } = useOverlay();

  const queryClient = useQueryClient();

  const onSubmit = (body: { title: string; tags: string[] }) => {
    mutate(
      { body, id: lotusId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['lotus', 'detail', lotusId] });
        }
      }
    );
    exit();
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
    <Button variant={'default'} onClick={handleOpenUpdateModal}>
      <IoSettingsSharp />
      <Text size="sm">수정하기</Text>
    </Button>
  );
}