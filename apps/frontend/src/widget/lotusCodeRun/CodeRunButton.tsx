import { Button } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { LotusRunCodeForm } from './LotusRunCodeForm';
import { lotusHistoryQueryOptions, useCodeRunMutation } from '@/feature/history/query';
import { ModalBox } from '@/shared';
import { useOverlay } from '@/shared/overlay';

export function CodeRunButton({ lotusId }: { lotusId: string }) {
  const { open, exit } = useOverlay();

  const { mutate } = useCodeRunMutation();

  const queryClient = useQueryClient();

  const handleCodeRun = ({ execFileName, inputs }: { execFileName: string; inputs: string[] }) => {
    mutate(
      { lotusId, input: inputs, execFileName },
      {
        onSuccess: () => {
          exit();
          queryClient.invalidateQueries(lotusHistoryQueryOptions.list({ id: lotusId }));
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

  return <Button onClick={handleOpenModal}>실행하기</Button>;
}
