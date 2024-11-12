import { Lotus } from '@/feature/Lotus';
import { LotusType } from '@/feature/Lotus/type';

const LotusDummyData: LotusType = {
  link: 'https://example.com',
  title: 'Understanding TypeScript',
  logo: '/image/exampleImage.jpeg',
  date: new Date('2024-11-10'),
  tags: ['aaa', 'bbb', 'ccc'],
  author: {
    id: 1,
    nickname: '개구리',
    profile: '/image/exampleImage.jpeg'
  }
};

export function LotusCardList() {
  return (
    <div className="w-full grid grid-cols-3 gap-[2rem]">
      {new Array(10).fill(0).map((_, index) => (
        <Lotus lotus={LotusDummyData} key={index}>
          <Lotus.Link className="max-w-[24rem] p-5 border-2 border-[#E2E8F0] rounded-[0.75rem]">
            <Lotus.Title className="text-[#1C1D22]" />
            <Lotus.Author className="text-[rgba(28,29,34,0.5)]" />
            <div className="w-full flex justify-between items-end">
              <Lotus.CreateDate className="text-xs font-bold text-[#888DA7] bg-[rgba(136,141,167,0.1)] px-[1rem] py-[0.5rem] rounded-3xl" />
              <Lotus.Logo />
            </div>
            {LotusDummyData?.tags?.length ? (
              <>
                <div className="mt-[1rem] w-full border-b-2 border-[#E2E8F0]" />
                <Lotus.TagList className="pt-[1rem] min-h-[2rem]" variant={'default'} />
              </>
            ) : (
              <></>
            )}
          </Lotus.Link>
        </Lotus>
      ))}
    </div>
  );
}
