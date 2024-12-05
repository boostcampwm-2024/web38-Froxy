import { ComponentProps } from 'react';
import { Heading, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Text } from '@froxy/design/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { lotusQueryOptions } from '@/feature/lotus';

type LotusRunFileSelectProps = ComponentProps<typeof Select> & { lotusId: string };

export function SuspenseLotusRunFileSelect({ lotusId, onValueChange }: LotusRunFileSelectProps) {
  const {
    data: { files }
  } = useSuspenseQuery(lotusQueryOptions.detail({ id: lotusId }));

  return (
    <div className="m-10">
      <Heading>실행할 파일</Heading>
      <Text className="pb-4" variant="muted">
        실행할 파일을 선택해 주세요.
      </Text>
      <Select onValueChange={onValueChange}>
        <SelectTrigger className="">
          <SelectValue placeholder="실행할 파일을 선택하세요." />
        </SelectTrigger>
        <SelectContent>
          {files.map((file) => (
            <SelectItem key={file.filename} value={file.filename}>
              {file.filename}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
