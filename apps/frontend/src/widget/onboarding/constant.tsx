import { FaCheckCircle, FaGithub } from 'react-icons/fa';

export const OnBoardingItems = [
  {
    icon: <FaGithub size={80} />,
    title: 'Gist clone과정을 폴짝! 건너뛰고 테스트',
    description: '손쉽게 Gist를 실행하고, 공유하세요.'
  },
  {
    icon: <div className="flex justify-center items-center w-20 h-20 p-2 text-5xl">⚡️</div>,
    title: 'Gist 실행, Froxy와 함께라면 순식간에!',
    description: 'Froxy는 당신의 시간과 노력을 아껴주는 완벽한 도우미입니다.'
  },
  {
    icon: <FaCheckCircle size={80} />,
    title: '하나하나 clone하기 힘들죠?',
    description: 'Froxy는 Gist를 clone하고, 실행하는 과정을 간소화합니다.'
  },
  {
    icon: <div className="flex justify-center items-center w-20 h-20 p-2 text-5xl">🔥</div>,
    title: 'Froxy에 맡기고 코드에 집중하세요!'
  }
];
