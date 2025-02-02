import { Suspense, useState } from 'react';
import { Button, Heading, Input, Switch, Text } from '@froxy/design/components';
import { useNavigate } from '@tanstack/react-router';
import { TiPencil } from 'react-icons/ti';
import { SuspenseGistFiles } from './SuspenseGistFiles';
import { SuspenseUserGistSelect } from './SuspenseUserGistSelect';
import { getLotusMutationErrorToastData, useLotusCreateMutation } from '@/feature/lotus';
import { AsyncBoundary } from '@/shared/boundary';
import { TagInput } from '@/shared/tagInput/TagInput';
import { useToast } from '@/shared/toast';

interface LotusCreateFormValue {
  title: string;
  tags: string[];
  gistUuid: string;
  isPublic: boolean;
}

export function LotusCreateForm() {
  const { mutate, isPending } = useLotusCreateMutation();

  const { toast } = useToast({ isCloseOnUnmount: false });

  const navigate = useNavigate();

  const [formValue, setFormValue] = useState<LotusCreateFormValue>({
    title: '',
    tags: [],
    isPublic: true,
    gistUuid: ''
  });

  const isValidateFormValue = formValue.title !== '' && formValue.gistUuid !== '' && !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        body: formValue
      },
      {
        onSuccess: ({ lotus }) => {
          navigate({ to: `/lotus/$lotusId`, params: { lotusId: lotus.id } });

          toast({ description: 'Lotus가 생성되었습니다.', variant: 'success', duration: 2000 });
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="my-4 mb-12 flex justify-between items-center gap-2">
          <Heading size="xl">Lotus 생성하기</Heading>

          <div className="flex gap-6">
            <div className={'flex items-center gap-2'}>
              <Switch
                checked={formValue.isPublic}
                onClick={() => setFormValue((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
              />
              <Text size="sm" variant="muted">
                private / public
              </Text>
            </div>
            <Button disabled={!isValidateFormValue}>
              {isPending ? (
                'Loading...'
              ) : (
                <>
                  <TiPencil />
                  생성하기
                </>
              )}
            </Button>
          </div>
        </div>
        <Text className="mb-2">제목</Text>
        <Input
          className={'min-w-80 mr-4 mb-4'}
          placeholder={`제목을 입력해주세요.`}
          title={formValue.title}
          onChange={(e) => setFormValue((prev) => ({ ...prev, title: e.target.value }))}
        />

        <Text className="mb-2">태그</Text>
        <TagInput value={formValue.tags} onChange={(tags) => setFormValue((prev) => ({ ...prev, tags }))} />
        <Text className="mb-2 mt-10">불러올 Gist</Text>

        <Suspense fallback={<SuspenseUserGistSelect.Skeleton />}>
          <SuspenseUserGistSelect onValueChange={(gistUuid) => setFormValue((prev) => ({ ...prev, gistUuid }))} />
        </Suspense>
      </form>

      {formValue.gistUuid && (
        <AsyncBoundary
          pending={<SuspenseGistFiles.Skeleton />}
          rejected={({ error, retry }) => <SuspenseGistFiles.Error error={error} retry={retry} />}
        >
          <SuspenseGistFiles gistId={formValue.gistUuid} />
        </AsyncBoundary>
      )}
    </>
  );
}
