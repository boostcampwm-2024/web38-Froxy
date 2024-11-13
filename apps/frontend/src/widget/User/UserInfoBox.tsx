import { Text } from '@froxy/design/components';
import { UserEditableInfo } from '@/feature/User/UserEditableInfo';

export function UserInfoBox() {
  return (
    <div className="flex items-center gap-16 w-full p-14 border-2 border-[#E2E8F0] rounded-[0.75rem] shadow-sm">
      {/* TODO: 나중에 프로필 사진 부분 하나의 feature로 합치기 */}
      <img className="w-44 h-44 rounded-full" src="/image/exampleImage.jpeg" alt="프로필 사진" />
      <div className="flex items-center gap-10">
        <div className="flex flex-col gap-5">
          <Text size="2xl" variant="semiBold" className="text-[#A3A3A3]">
            NICKNAME
          </Text>
          <Text size="2xl" variant="semiBold" className="text-[#A3A3A3]">
            GIST ADDRESS
          </Text>
          <Text size="2xl" variant="semiBold" className="text-[#A3A3A3]">
            TOTAL LOTUS
          </Text>
        </div>
        <div className="flex flex-col gap-4">
          <UserEditableInfo label="닉네임" initialValue="froxy" editValue={(value) => console.log('편집: ', value)} />
          <UserEditableInfo
            label="주소"
            initialValue="/github/gist/froxy"
            editValue={(value) => console.log('편집: ', value)}
          />
          <Text size="3xl" variant="semiBold">
            12
          </Text>
        </div>
      </div>
    </div>
  );
}
