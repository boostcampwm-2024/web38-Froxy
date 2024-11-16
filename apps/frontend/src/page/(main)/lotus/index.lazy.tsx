import { useEffect } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { LotusCardList } from '@/widget/LotusList/LotusCardList';
import { LotusSearchBar } from '@/widget/LotusList/LotusSearchBar';

export const Route = createLazyFileRoute('/(main)/lotus/')({
  component: RouteComponent
});

function RouteComponent() {
  useEffect(() => {
    const fetchUserInfo = async () => {
      const body = {
        nickname: '닉네임'
      };
      try {
        const token = 'your_bearer_token_here'; // 여기에 실제 토큰을 넣으세요.
        const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/user`, body, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log(response.data);
      } catch (err: unknown) {
        console.log(err);
      }
    };

    fetchUserInfo();
  }, []); // 빈 배열을 두어 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="flex flex-col gap-8">
      <LotusSearchBar />
      <LotusCardList />
    </div>
  );
}
