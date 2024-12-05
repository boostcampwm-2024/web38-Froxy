import { Button, Heading, Text } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { getLotusMutationErrorToastData, lotusQueryOptions, useLotusDeleteMutation } from '@/feature/lotus';
import { ModalBox } from '@/shared';
import { useOverlay } from '@/shared/overlay';
import { useToast } from '@/shared/toast';

export function LotusDeleteButton({ lotusId }: { lotusId: string }) {
  const { mutate, isPending } = useLotusDeleteMutation();

  const queryClient = useQueryClient();

  const { open, exit } = useOverlay();
  const { toast } = useToast({ isCloseOnUnmount: false });

  const navigate = useNavigate();

  const handleDeleteLotus = () => {
    exit();

    mutate(
      { id: lotusId },
      {
        onSuccess: () => {
          toast({ description: 'Lotus가 삭제되었습니다.', variant: 'success', duration: 2000 });
          queryClient.invalidateQueries(lotusQueryOptions.list({}));
          navigate({ to: '/lotus' });
        },
        onError: (error) => {
          toast({
            ...getLotusMutationErrorToastData(error),
            duration: 2000
          });
        }
      }
    );
  };

  const handleOpenDeleteModal = () => {
    open(() => (
      <ModalBox onClose={exit}>
        <div className="p-6 w-80 bg-white rounded-lg">
          <Heading size="sm" className="p-2 pb-8 text-center">
            정말로 삭제하시겠습니까?
          </Heading>
          <div className="flex gap-2">
            <Button type="button" className="w-full" variant={'secondary'} onClick={exit}>
              취소하기
            </Button>
            <Button className="w-full" variant={'destructive'} onClick={handleDeleteLotus}>
              삭제하기
            </Button>
          </div>
        </div>
      </ModalBox>
    ));
  };

  return (
    <Button variant={'destructive'} onClick={handleOpenDeleteModal} disabled={isPending}>
      <RiDeleteBin5Fill />
      <Text size="sm">삭제하기</Text>
    </Button>
  );
}

function SkeletonLotusDeleteButton() {
  return (
    <Button variant={'destructive'} disabled>
      <RiDeleteBin5Fill />
      <Text size="sm">삭제하기</Text>
    </Button>
  );
}

LotusDeleteButton.Skeleton = SkeletonLotusDeleteButton;
