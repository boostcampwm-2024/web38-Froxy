import { useState } from 'react';
import { Text } from '@froxy/design/components';
import { Skeleton } from '@froxy/design/components';
import { useQueryClient } from '@tanstack/react-query';
import { GoPencil } from 'react-icons/go';
import { UserInfoInputForm } from '@/feature/user/component';
import { useUserInfoSuspenseQuery, useUserMutation } from '@/feature/user/query';
import { useToast } from '@/shared/toast';

export function SuspenseUserInfoBox() {
  const queryClient = useQueryClient();
  const { data: user } = useUserInfoSuspenseQuery();
  const { mutate } = useUserMutation();
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
          queryClient.invalidateQueries({ queryKey: ['user'] });
          toast({
            variant: 'success',
            description: '닉네임이 수정되었습니다.',
            duration: 2000
          });
        }
      }
    );
  };

  return (
    <div className="flex items-center gap-16 w-full p-14 border-2 border-slate-200 rounded-xl shadow-sm">
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
            /github/gist/123
          </Text>
          <Text size="2xl" className="text-gray-400 font-semibold">
            TOTAL LOTUS
          </Text>
          <Text size="3xl" className="col-span-2 font-semibold">
            12
          </Text>
        </div>
      </div>
    </div>
  );
}

function SkeletonUserInfoBox() {
  return (
    <div className="flex items-center gap-16 w-full p-14 border-2 border-slate-200 rounded-xl shadow-sm">
      <Skeleton className="w-44 h-44 rounded-full" />
      <div className="flex items-center gap-10">
        <div className="grid grid-cols-3 items-end gap-5">
          <Skeleton className="min-w-64 h-6" />
          <Skeleton className="col-span-2 h-10 w-full" />
          <Skeleton className="h-6" />
          <Skeleton className="col-span-2 h-10 w-full" />
          <Skeleton className="h-6" />
          <Skeleton className="col-span-2 h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

SuspenseUserInfoBox.Skeleton = SkeletonUserInfoBox;
