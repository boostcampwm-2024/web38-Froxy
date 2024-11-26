import { useState } from 'react';
import { Button, Heading, Text } from '@froxy/design/components';
import { LotusCodeDynamicInput } from './LotusCodeDynamicInput';
import { SuspenseLotusRunFileSelect } from './LotusRunFileSelect';
import { AsyncBoundary } from '@/shared/boundary';

interface LotusRunCodeFormProps {
  lotusId: string;
  onSubmit?: ({ execFileName, inputs }: { execFileName: string; inputs: string[] }) => void;
  onCancel?: () => void;
}

export function LotusRunCodeForm({ lotusId, onCancel, onSubmit }: LotusRunCodeFormProps) {
  const [execFileName, setExecFileName] = useState<string>('');
  const [inputs, setInputs] = useState<string[]>([]);

  const handleSubmit = () => {
    onSubmit?.({ execFileName, inputs });
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleExecFileChange = (value: string) => {
    setExecFileName(value);
  };

  return (
    <div className="w-xl max-h-[680px] overflow-scroll bg-white rounded-lg">
      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusRunFileSelect lotusId={lotusId} onValueChange={handleExecFileChange} />
      </AsyncBoundary>

      <section className={'m-10'}>
        <Heading>실행 입력 코드</Heading>
        <Text variant="muted">다음의 코드가 실행 시 순서대로 입력됩니다. 드래그를 통해 순서를 변경할 수 있습니다.</Text>
        <LotusCodeDynamicInput
          className={'my-10'}
          onChangeValue={(data) => setInputs(data.items.map((item) => item.input))}
        />

        <div className="flex gap-2">
          <Button type="button" className="w-full" variant={'secondary'} onClick={handleCancel}>
            취소하기
          </Button>
          <Button className="w-full" type="submit" disabled={execFileName === ''} onClick={() => handleSubmit()}>
            완료하기
          </Button>
        </div>
      </section>
    </div>
  );
}
