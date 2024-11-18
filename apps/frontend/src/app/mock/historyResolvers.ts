import { DefaultBodyType, HttpResponse, PathParams, StrictRequest } from 'msw';
import { MockRepository } from './MockRepository';

// 사용자의 Lotus 목록 조회
export const mockGetUserLotusList = () => {
  return HttpResponse.json({
    lotuses: [
      {
        id: '10000000001',
        title: 'Exploring the Depths of TypeScript',
        tags: ['TypeScript', 'Programming', 'Web Development'],
        language: 'English',
        date: '2024-11-16',
        author: {
          id: '20000000001',
          nickname: 'dev_master',
          profile: '/image/exampleImage.jpeg'
        }
      },
      {
        id: '10000000002',
        title: 'Understanding React Hooks',
        tags: ['React', 'JavaScript', 'Frontend'],
        language: 'English',
        date: '2024-11-15',
        author: {
          id: '20000000002',
          nickname: 'react_enthusiast',
          profile: '/image/exampleImage.jpegt'
        }
      }
    ],
    page: {
      current: 1,
      max: 5
    }
  });
};

// public lotus 목록 조회
export const mockGetPublicLotusList = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 0;
  // const size = Number(url.searchParams.get('size')) || 10;
  // const search = url.searchParams.get('search') || "";

  return HttpResponse.json({
    lotuses: [
      {
        id: '10000000001',
        title: 'Exploring the Depths of TypeScript',
        tags: ['TypeScript', 'Programming', 'Web Development'],
        language: 'English',
        date: '2024-11-16',
        author: {
          id: '20000000001',
          nickname: 'dev_master',
          profile: 'https://example.com/profiles/dev_master'
        }
      },
      {
        id: '10000000002',
        title: 'Understanding React Hooks',
        tags: ['React', 'JavaScript', 'Frontend'],
        language: 'English',
        date: '2024-11-15',
        author: {
          id: '20000000002',
          nickname: 'react_enthusiast',
          profile: 'https://example.com/profiles/react_enthusiast'
        }
      }
    ],
    page: {
      current: page,
      max: 5
    }
  });
};

// 특정 Lotus 조회
export const mockGetLotusDetail = ({
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

  const { lotusId } = params;

  if (!lotusId) {
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  return HttpResponse.json({
    id: '10000000001',
    title: 'Exploring the Depths of TypeScript',
    tags: ['TypeScript', 'Programming', 'Web Development'],
    language: 'English',
    date: '2024-11-16',
    isPublic: true,
    author: {
      id: '20000000001',
      nickname: 'dev_master',
      profile: 'https://example.com/profiles/dev_master'
    },
    files: [
      {
        filename: 'index.tsx',
        language: 'ts',
        content: 'const a = 1;\nconsole.log(a);\n'
      }
    ]
  });
};

interface HistoryType {
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  date: string;
  filename: string;
  input?: string[];
  output?: string;
}

const historyList = new MockRepository<HistoryType>();

const insertHistory = () => {
  const historyMock: HistoryType[] = [
    {
      status: 'SUCCESS',
      date: '2024-11-15T14:30:00Z',
      filename: 'main.js',
      input: ['1', '2'],
      output: '3'
    },
    {
      status: 'SUCCESS',
      date: '2024-11-16T12:00:00Z',
      filename: 'index.js',
      input: ['3', '4'],
      output: 'console.log(7)'
    },
    {
      status: 'ERROR',
      date: '2024-11-14T16:45:00Z',
      filename: 'main.js',
      input: ['5', '6'],
      output: 'Error: Cannot find module'
    }
  ];

  for (const item of historyMock) {
    historyList.create(item);
  }
};

insertHistory();

// Lotus History 목록 조회
export const mockGetHistoryList = async ({
  request,
  params
}: {
  request: StrictRequest<DefaultBodyType>;
  params: PathParams;
}) => {
  const { lotusId } = params;

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;

  if (!lotusId) {
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  const list = await historyList.findMany({ page });

  return HttpResponse.json({
    list,
    page: {
      current: page,
      max: 3
    }
  });
};

// 코드 실행
interface PostCodeRunBody {
  input?: string[];
  execFileName: string;
}

export const mockPostCodeRun = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const body = (await request.json()) as PostCodeRunBody;

  if (!body?.execFileName)
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

  const newHistory = await historyList.create({
    filename: body.execFileName,
    date: new Date().toISOString(),
    status: 'PENDING',
    input: body.input
  });

  setTimeout(() => {
    historyList.update(
      { id: newHistory.id },
      {
        status: 'SUCCESS',
        output: `입력한 값: ${newHistory.input} `
      }
    );
  }, 2000);

  return HttpResponse.json({
    status: newHistory.status
  });
};

// 해당 히스토리 정보
export const mockGetHistory = async ({ params }: { params: PathParams }) => {
  const { lotusId, historyId } = params;

  if (!lotusId || !historyId) {
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  const history = await historyList.findOne({ id: historyId as string });

  return HttpResponse.json(history);
};

// Lotus 생성
interface PostCreateLotusBody {
  title: string;
  isPublic: boolean;
  tag: string[];
  gistUuid: string;
}

export const mockPostCreateLotus = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const authorization = request.headers.get('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new HttpResponse('Unauthorized: Invalid or missing token', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    const body = (await request.json()) as PostCreateLotusBody;

    if (!body) throw new Error('body 형식이 올바르지 않음');

    return HttpResponse.json({
      id: '1234567890',
      user: {
        id: '9876543210',
        nickname: 'coding_expert',
        profile: 'https://example.com/profiles/coding_expert'
      },
      title: 'Understanding TypeScript Generics',
      isPublic: true,
      createAt: '2024-11-16T10:00:00Z',
      tag: [
        {
          tagName: 'TypeScript'
        },
        {
          tagName: 'Generics'
        },
        {
          tagName: 'Programming'
        }
      ]
    });
  } catch (error) {
    console.error(error);
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
};

// Lotus 수정
interface PatchLotusBody {
  title: string;
  tag: string[];
  isPublic: boolean;
}

export const mockPatchLotus = async ({
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

  try {
    const { id } = params;
    const body = (await request.json()) as PatchLotusBody;

    if (!body || !id) throw new Error('요청 형식이 올바르지 않음');

    return HttpResponse.json({
      id: '1234567890',
      user: {
        id: '9876543210',
        nickname: 'coding_expert',
        profile: 'https://example.com/profiles/coding_expert'
      },
      title: 'Understanding TypeScript Generics',
      isPublic: true,
      createAt: '2024-11-16T10:00:00Z',
      tag: [
        {
          tagName: 'TypeScript'
        },
        {
          tagName: 'Generics'
        },
        {
          tagName: 'Programming'
        }
      ]
    });
  } catch (error) {
    console.error(error);
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
};

// Lotus 삭제
export const mockDeleteLotus = async ({
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

  const { id } = params;

  if (!id) {
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  return HttpResponse.json({
    message: '삭제 성공'
  });
};

// 태그 조회
export const mockGetTagList = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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
  const keyword = url.searchParams.get('keyword');

  if (!keyword) {
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  return HttpResponse.json({
    tags: [
      {
        tagName: 'TypeScript'
      },
      {
        tagName: 'Generics'
      },
      {
        tagName: 'Programming'
      }
    ]
  });
};

// 태그 생성
interface PostTagBody {
  tag: string;
}

export const mockPostTag = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const authorization = request.headers.get('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new HttpResponse('Unauthorized: Invalid or missing token', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    const body = (await request.json()) as PostTagBody;

    if (!body) throw new Error('요청 형식이 올바르지 않음');

    return HttpResponse.json({
      message: '성공'
    });
  } catch (error) {
    console.error(error);
    return new HttpResponse('Bad Request', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
};
