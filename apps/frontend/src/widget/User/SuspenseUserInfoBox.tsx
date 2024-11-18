import { useState } from 'react';
import { Text } from '@froxy/design/components';
import { GoPencil } from 'react-icons/go';
import { useUserInfoSuspenseQuery } from '@/feature/User/query';
import { UserInfoInputForm } from '@/feature/User/UserInfoInputForm';

export function SuspenseUserInfoBox() {
  const { data: user } = useUserInfoSuspenseQuery();

  const [isEdit, setIsEdit] = useState(false);

  const onToggleIsEdit = () => {
    setIsEdit(!isEdit);
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
                value={'froxy'}
                onToggleIsEdit={onToggleIsEdit}
                onEditValue={(value) => console.log('편집:', value)}
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
