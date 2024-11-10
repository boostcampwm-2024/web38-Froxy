import { Button } from '@froxy/design/components';
import { createLazyFileRoute } from '@tanstack/react-router';
import { CodeView } from '@/feature/CodeView';

export const Route = createLazyFileRoute('/about')({
  component: RouteComponent
});

const MockCodeList = [
  {
    fileName: 'index.tsx',
    ext: 'tsx',
    code: '```tsx\nconst a = 1;\nconsole.log(a);\n```'
  },
  {
    fileName: 'main.tsx',
    ext: 'tsx',
    code: `const a = 1;`
  },
  {
    fileName: 'README.md',
    ext: 'md',
    code: `# Hello World\n\n This is a markdown file.`
  }
];

function RouteComponent() {
  return (
    <div>
      <CodeView value={MockCodeList}>
        <div className="flex w-full h-[400px]">
          <CodeView.SideBar />
          <CodeView.Viewer />
        </div>
      </CodeView>
    </div>
  );
}
