import { useState } from 'react';
import { Button, Heading, Input, Text } from '@froxy/design/components';
import { useLotusSuspenseQuery } from '@/feature/lotus';
import { TagInput } from '@/shared';

interface LotusUpdateFormProps {
  lotusId: string;
  onSubmit?: (args: { title: string; tags: string[] }) => void;
  onCancel?: () => void;
}

export function LotusUpdateForm({ lotusId, onSubmit, onCancel }: LotusUpdateFormProps) {
  const { data: lotus } = useLotusSuspenseQuery({ id: lotusId });

  const [title, setTitle] = useState(lotus.title);

  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = () => {
    onSubmit?.({ title, tags });
  };

  return (
    <form>
      <Heading size="sm" className="pb-6">
        Lotus 수정하기
      </Heading>
      <Text className="mb-2">제목</Text>
      <Input
        className={'min-w-80 mr-4 mb-4'}
        placeholder={`제목을 입력해주세요.`}
        title={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Text className="mb-2">태그</Text>
      <TagInput value={tags} onChange={setTags} />
      <div className="mt-4 flex gap-2">
        <Button type="button" className="w-full" variant={'secondary'} onClick={onCancel}>
          취소하기
        </Button>
        <Button type="button" className="w-full" variant={'default'} onClick={handleSubmit}>
          수정하기
        </Button>
      </div>
    </form>
  );
}
