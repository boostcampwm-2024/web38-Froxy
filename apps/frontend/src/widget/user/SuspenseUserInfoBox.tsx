import { useState } from 'react';
import { Text } from '@froxy/design/components';
import { Button, Heading, Skeleton } from '@froxy/design/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQueryClient, useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GoPencil } from 'react-icons/go';
import { UserInfoInputForm } from '@/feature/user/component';
import { useUserMutation, userQueryOptions } from '@/feature/user/query';
import { useToast } from '@/shared/toast';

export function SuspenseUserInfoBox() {
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(userQueryOptions.info());

  const { mutate, isPending } = useUserMutation();

  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState(false);

  const onToggleIsEdit = () => {
    setIsEdit(!isEdit);
  };

  const onEditUserInfo = (nickname: string) => {
    mutate(
      { body: { nickname } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(userQueryOptions.info());

          toast({
            variant: 'success',
            description: '닉네임이 수정되었습니다.',
            duration: 2000
          });
        },
        onError: () => {
          toast({
            variant: 'error',
            description: '닉네임 수정 중 오류가 발생했습니다. 다시 시도해 주세요.',
            duration: 2000
          });
        }
      }
    );
  };

  return (
    <div className="flex items-center gap-16 w-full p-10 border-2 border-slate-200 rounded-xl shadow-sm">
      {/* TODO: 나중에 프로필 사진 부분 하나의 feature로 합치기 */}
      <img className="w-44 h-44 rounded-full" src={user.profile} alt="프로필 사진" />
      <div className="flex items-center gap-10">
        <div className="grid grid-cols-3 items-end gap-5">
          <Text size="2xl" className="min-w-64 text-gray-400 font-semibold">
            NICKNAME
          </Text>
          <div className="col-span-2">
            {isEdit ? (
              <UserInfoInputForm
                disabled={isPending}
                value={user.nickname}
                onToggleIsEdit={onToggleIsEdit}
                onEditValue={(value) => onEditUserInfo(value)}
              />
            ) : (
              <div className="flex items-center gap-10">
                <Text size="3xl" className="font-semibold">
                  {user.nickname}
                </Text>
                <GoPencil className="w-6 h-6" onClick={() => setIsEdit(true)} />
              </div>
            )}
          </div>
          <Text size="2xl" className="text-gray-400 font-semibold">
            GIST ADDRESS
          </Text>
          <Text size="3xl" className="col-span-2 font-semibold">
            {user.gistUrl}
          </Text>
        </div>
      </div>
    </div>
  );
}

function SkeletonUserInfoBox() {
  return (
    <div className="flex items-center gap-16 w-full p-10 border-2 border-slate-200 rounded-xl shadow-sm">
      <Skeleton className="w-44 h-44 rounded-full" />
      <div className="flex items-center gap-10">
        <div className="grid grid-cols-3 items-end gap-5">
          <Skeleton className="min-w-64 h-6" />
          <Skeleton className="col-span-2 h-10 w-full" />
          <Skeleton className="h-6" />
          <Skeleton className="col-span-2 h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

SuspenseUserInfoBox.Skeleton = SkeletonUserInfoBox;

interface ErrorProps {
  error: unknown;
  retry: () => void;
}

function ErrorUserInfoBox({ error, retry }: ErrorProps) {
  const { reset } = useQueryErrorResetBoundary();

  if (axios.isAxiosError(error)) throw error;

  const handleRetry = async () => {
    reset();
    retry();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-10 border-2 border-slate-200 rounded-xl shadow-sm">
      <DotLottieReact src="/json/errorAnimation.json" loop autoplay className="w-96" />
      <Heading className="py-4">사용자 정보 조회에 실패했습니다.</Heading>
      <Button onClick={handleRetry}>재시도</Button>
    </div>
  );
}

SuspenseUserInfoBox.Error = ErrorUserInfoBox;
