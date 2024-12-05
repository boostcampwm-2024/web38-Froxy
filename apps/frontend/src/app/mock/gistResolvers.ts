import { HttpResponse, PathParams } from 'msw';

// 사용자의 Gist 목록 조회
export const getUserGistList = () => {
  return HttpResponse.json({
    gists: [
      {
        gistId: 'abc123',
        title: 'My First Gist',
        nickname: 'tech_guru'
      },
      {
        gistId: 'def456',
        title: 'React Hook Tips',
        nickname: 'frontend_master'
      },
      {
        gistId: 'ghi789',
        title: 'Node.js Best Practices',
        nickname: 'backend_expert'
      }
    ],
    page: 1,
    size: 10,
    hasNextPage: true
  });
};

// 특정 Gist 파일 조회 api
export const getGistDetail = ({ params }: { params: PathParams }) => {
  const { gistId } = params;

  if (!gistId) {
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  return HttpResponse.json({
    files: [
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
    ]
  });
};
