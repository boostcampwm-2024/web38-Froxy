import { Button, Heading, Text } from '@froxy/design/components';
import { useNavigate } from '@tanstack/react-router';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { useLotusDeleteMutation } from '@/feature/Lotus';
import { ModalBox } from '@/shared/components/Overlay';
import { useOverlay } from '@/shared/hooks/useOverlay';

export function LotusDeleteButton({ lotusId }: { lotusId: string }) {
  const { mutate } = useLotusDeleteMutation();
  const { open, close } = useOverlay();

  const navigate = useNavigate();

  const handleDeleteLotus = () => {
    mutate(
      { id: lotusId },
      {
        onSuccess: () => {
          console.log('성공');
          navigate({ to: '/lotus' });
        }
      }
    );
    close();
  };

  const handleOpenDeleteModal = () => {
    open(
      <ModalBox onClose={close}>
        <div className="p-6 w-80 bg-white rounded-lg">
          <Heading size="sm" className="p-2 pb-8 text-center">
            정말로 삭제하시겠습니까?
          </Heading>
          <div className="flex gap-2">
            <Button type="button" className="w-full" variant={'secondary'} onClick={close}>
              취소하기
            </Button>
            <Button className="w-full" variant={'destructive'} onClick={handleDeleteLotus}>
              삭제하기
            </Button>
          </div>
        </div>
      </ModalBox>
    );
  };

  return (
    <Button variant={'destructive'} onClick={handleOpenDeleteModal}>
      <RiDeleteBin5Fill />
      <Text size="sm">삭제하기</Text>
    </Button>
  );
}
