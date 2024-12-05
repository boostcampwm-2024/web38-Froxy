import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Heading, Skeleton } from '@/components';
import { CodeFileModel, CodeView } from '@/feature/codeView';
import { userQueryOptions } from '@/feature/user/query';
import '@/app/style/github.css';

export function SuspenseGistFiles({ gistId }: { gistId: string }) {
  const { data: files } = useSuspenseQuery(userQueryOptions.gistFile({ gistId }));

  const defaultFile = CodeFileModel.getDefaultFile(files);
  const defaultFileIndex = defaultFile ? files.findIndex((file) => defaultFile?.filename === file.filename) : 0;

  return (
    <CodeView value={files} current={defaultFileIndex}>
      <div className="flex github gap-6 w-full h-[600px] mt-20 pb-10 px-2 overflow-hidden">
        <CodeView.SideBar className="h-full min-w-48" />
        <CodeView.Viewer className="block h-full" />
      </div>
    </CodeView>
  );
}

export function SkeletonGistFiles() {
  return (
    <div className="flex github gap-6 w-full h-[600px] mt-20 pb-10 px-2 overflow-hidden">
      <Skeleton className="h-full min-w-48" />
      <Skeleton className="block w-full" />
    </div>
  );
}

SuspenseGistFiles.Skeleton = SkeletonGistFiles;

interface ErrorProps {
  error: unknown;
  retry: () => void;
}

function ErrorGistFiles({ error, retry }: ErrorProps) {
  const { reset } = useQueryErrorResetBoundary();

  if (axios.isAxiosError(error) && error?.status === 401) throw error;

  const handleRetry = async () => {
    reset();
    retry();
  };

  return (
    <div className="w-full h-[600px] mt-20 pb-10 flex flex-col justify-center items-center">
      <DotLottieReact src="/json/errorAnimation.json" loop autoplay className="w-96" />
      <Heading className="py-4">선택한 Gist의 파일 조회에 실패했습니다</Heading>
      <Button onClick={handleRetry}>재시도</Button>
    </div>
  );
}

SuspenseGistFiles.Error = ErrorGistFiles;
