import { Button, Text } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { IoSettingsSharp } from 'react-icons/io5';
import { LotusUpdateForm } from './LotusUpdateForm';
import { useLotusUpdateMutation } from '@/feature/Lotus';
import { ModalBox } from '@/shared/components/Overlay';
import { useOverlay } from '@/shared/hooks/useOverlay';

export function LotusUpdateButton({ lotusId }: { lotusId: string }) {
  const { mutate } = useLotusUpdateMutation();

  const { open, close } = useOverlay();

  const queryClient = useQueryClient();

  const onSubmit = (args: { title: string; tags: string[] }) => {
    mutate(
      { body: { ...args, tag: args.tags }, id: lotusId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['lotus', 'detail', lotusId] });
        }
      }
    );
    close();
  };

  const handleOpenUpdateModal = () => {
    open(
      <ModalBox onClose={close}>
        <div className="p-6 w-1/2 bg-white rounded-lg">
          <LotusUpdateForm lotusId={lotusId} onSubmit={onSubmit} onCancel={close} />
        </div>
      </ModalBox>
    );
  };

  return (
    <Button variant={'default'} onClick={handleOpenUpdateModal}>
      <IoSettingsSharp />
      <Text size="sm">수정하기</Text>
    </Button>
  );
}
