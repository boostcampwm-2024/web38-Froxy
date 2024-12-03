import { useState } from 'react';
import { Text } from '@froxy/design/components';
import { Button, Heading, Skeleton } from '@froxy/design/components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQueryClient, useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaGithub } from 'react-icons/fa';
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
    <div className="flex flex-col justify-center items-center gap-10 w-full p-4">
      <div className="relative bg-white p-4 rounded-full shadow-lg">
        <img className="w-44 h-44 rounded-full" src={user.profile} alt="프로필 사진" />
        <a
          href={user.gistUrl}
          className="absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-lg hover:shadow-neutral-400"
        >
          <FaGithub size={30} />
        </a>
      </div>
      <div className="flex items-center gap-5">
        {isEdit ? (
          <UserInfoInputForm
            disabled={isPending}
            value={user.nickname}
            onToggleIsEdit={onToggleIsEdit}
            onEditValue={(value) => onEditUserInfo(value)}
          />
        ) : (
          <>
            <div className="w-6 h-6"></div>
            <Text size="3xl" className="font-semibold">
              {user.nickname}
            </Text>
            <GoPencil className="w-6 h-6 cursor-pointer" onClick={() => setIsEdit(true)} />
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonUserInfoBox() {
  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full p-4">
      <div className="relative bg-white p-4 rounded-full shadow-lg">
        <Skeleton className="w-44 h-44 rounded-full" />
        <Skeleton className="absolute bottom-0 right-0 bg-white w-14 h-14 rounded-full shadow-lg hover:shadow-neutral-400" />
      </div>
      <div className="flex items-center gap-5">
        <div className="w-6 h-6"></div>
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-6 h-6" />
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
