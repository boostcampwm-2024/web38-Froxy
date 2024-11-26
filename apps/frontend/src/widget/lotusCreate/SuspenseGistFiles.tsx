import { useSuspenseQuery } from '@tanstack/react-query';
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
