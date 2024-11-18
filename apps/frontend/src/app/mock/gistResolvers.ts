import { DefaultBodyType, HttpResponse, PathParams, StrictRequest } from 'msw';

// 사용자의 Gist 목록 조회
export const mockGetUserGistList = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const authorization = request.headers.get('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new HttpResponse('Unauthorized: Invalid or missing token', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const size = url.searchParams.get('size');

  if (!page || !size) {
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

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
export const mockGetGistDetail = ({
  request,
  params
}: {
  request: StrictRequest<DefaultBodyType>;
  params: PathParams;
}) => {
  const authorization = request.headers.get('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new HttpResponse('Unauthorized: Invalid or missing token', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

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
