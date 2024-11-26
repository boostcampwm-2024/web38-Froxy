import { Button } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { LotusRunCodeForm } from './LotusRunCodeForm';
import { lotusHistoryQueryOptions, useCodeRunMutation } from '@/feature/history/query';
import { ModalBox } from '@/shared';
import { useOverlay } from '@/shared/overlay';
import { useToast } from '@/shared/toast';

export function CodeRunButton({ lotusId }: { lotusId: string }) {
  const { open, exit } = useOverlay();

  const { toast } = useToast();

  const { mutate, isPending } = useCodeRunMutation();

  const queryClient = useQueryClient();

  const handleCodeRun = ({ execFileName, inputs }: { execFileName: string; inputs: string[] }) => {
    exit();

    mutate(
      { lotusId, input: inputs, execFileName },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(lotusHistoryQueryOptions.list({ id: lotusId }));
          toast({ description: '코드가 실행되었습니다.', variant: 'success', duration: 2000 });
        },
        onError: () => {
          toast({
            description: '코드 실행 중 오류가 발생했습니다. 다시 시도해 주세요.',
            variant: 'error',
            duration: 2000
          });
        }
      }
    );
  };

  const handleOpenModal = () =>
    open(() => (
      <ModalBox onClose={exit}>
        <LotusRunCodeForm onCancel={() => exit()} onSubmit={handleCodeRun} lotusId={lotusId} />
      </ModalBox>
    ));

  return (
    <Button onClick={handleOpenModal} disabled={isPending}>
      실행하기
    </Button>
  );
}
