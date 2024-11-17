import { Button, Heading, Text } from '@froxy/design/components';
import { createLazyFileRoute } from '@tanstack/react-router';
import { IoSettingsSharp } from 'react-icons/io5';
import { CodeView, CodeViewValue } from '@/feature/CodeView';
import { CommentCard, CommentForm } from '@/feature/Comment';
import { HISTORY_STATUS, HistoryType } from '@/feature/History';
import { Lotus } from '@/feature/Lotus';
import { LotusType } from '@/feature/Lotus/type';
import { HistoryList } from '@/widget/HistoryList';

export const Route = createLazyFileRoute('/(main)/lotus/$lotusId/')({
  component: RouteComponent
});

const LotusDummyData: LotusType = {
  id: '1',
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

const MockCodeList: CodeViewValue[] = [
  {
    filename: 'index.tsx',
    language: 'ts',
    content: 'const a = 1;\nconsole.log(a);\n'
  },
  {
    filename: 'main.tsx',
    language: 'ts',
    content: `const a = 1;`
  },
  {
    filename: 'README.md',
    language: 'md',
    content: `# Hello World\n\n This is a markdown file.`
  }
];

export const HistoryData: HistoryType[] = [
  {
    id: '1',
    title: 'Upload File',
    date: new Date('2024-11-10'),
    status: HISTORY_STATUS.SUCCESS
  },
  {
    id: '2',
    title: 'Download Report',
    date: new Date('2024-11-11'),
    status: HISTORY_STATUS.ERROR
  },
  {
    id: '3',
    title: 'Process Data',
    date: new Date('2024-11-12'),
    status: HISTORY_STATUS.PENDING
  },
  {
    id: '4',
    title: 'Generate Invoice',
    date: new Date('2024-11-13'),
    status: HISTORY_STATUS.SUCCESS
  },
  {
    id: '5',
    title: 'Send Notification',
    date: new Date('2024-11-14'),
    status: HISTORY_STATUS.ERROR
  }
];

export const CommentData = [
  {
    id: 'c1',
    comment: 'Great job on the project!',
    updatedAt: new Date('2024-11-10'),
    author: {
      id: 'u1',
      nickname: 'JohnDoe',
      profile: '/image/exampleImage.jpeg'
    }
  },
  {
    id: 'c2',
    comment: 'I found this very helpful, thanks for sharing.',
    updatedAt: new Date('2024-11-11'),
    author: {
      id: 'u2',
      nickname: 'JaneSmith',
      profile: '/image/exampleImage.jpeg'
    }
  },
  {
    id: 'c3',
    comment: 'Could you explain this part in more detail?',
    updatedAt: new Date('2024-11-12'),
    author: {
      id: 'u3',
      nickname: 'AlexKim',
      profile: '/image/exampleImage.jpeg'
    }
  }
];

function RouteComponent() {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex justify-between pb-4 border-b-2 border-slate-200">
        <div>
          <Lotus lotus={LotusDummyData}>
            <div className="flex items-end mb-4">
              <Lotus.Title className="text-3xl font-bold mr-4" />
              {LotusDummyData?.tags?.length ? (
                <Lotus.TagList className="pt-[1rem] min-h-[2rem]" variant={'default'} />
              ) : (
                <></>
              )}
            </div>
            <Lotus.Author className="text-[rgba(28,29,34,0.5)]" />
            <Lotus.CreateDate className="text-xs text-[rgba(28,29,34,0.5)]" />
          </Lotus>
        </div>
        <div>
          <Button variant={'secondary'}>
            <IoSettingsSharp />
            설정
          </Button>
        </div>
      </div>

      <div>
        <Heading size="lg" className="mb-4">
          Files
        </Heading>
        <CodeView value={MockCodeList}>
          <div className="flex gap-6 w-full min-h-[400px]">
            <CodeView.SideBar className="min-h-[400px] min-w-48" />
            <CodeView.Viewer className="min-h-[400px]" />
          </div>
        </CodeView>
      </div>
      <div className="flex gap-6">
        <HistoryList historyList={HistoryData} />
        <div className="flex-1 h-96 flex justify-center items-center rounded-2xl bg-slate-300">
          <Text size="2xl" variant="muted">
            Coming Soon 😘
          </Text>
        </div>
      </div>
      <div>
        <Heading size="lg" className="mb-4">
          Comments
        </Heading>
        {CommentData.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        <CommentForm className="mt-10" />
      </div>
    </div>
  );
}
