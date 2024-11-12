import { Heading, Text } from '@froxy/design/components';
import { cn } from '@froxy/design/utils';
import { LotusCodeFormValues, LotusCodeInputForm } from './LotusCodeInputForm';

type LotusCodeInputSectionProps = {
  className?: string;
};

export function LotusCodeInputSection({ className }: LotusCodeInputSectionProps) {
  const handelSubmit = ({ data, reset }: { data: LotusCodeFormValues; reset: () => void }) => {
    console.log(data);
    reset();
  };

  return (
    <section className={cn('m-10', className)}>
      <Heading>실행 입력 코드</Heading>
      <Text variant="muted">다음의 코드가 실행 시 순서대로 입력됩니다. 드래그를 통해 순서를 변경할 수 있습니다.</Text>
      <LotusCodeInputForm className={'my-10'} onSubmit={handelSubmit} />
    </section>
  );
}
