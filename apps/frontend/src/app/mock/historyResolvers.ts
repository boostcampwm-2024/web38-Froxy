import { DefaultBodyType, HttpResponse, PathParams, StrictRequest } from 'msw';
import { MockRepository } from './MockRepository';
import { HistoryDto } from '@/feature/history';

const historyList = new MockRepository<Omit<HistoryDto, 'id'>>();

const insertHistory = () => {
  const historyMock: HistoryDto[] = [
    {
      id: '2000001',
      status: 'SUCCESS',
      date: '2024-11-15T14:30:00Z',
      filename: 'main.js',
      input: '11',
      output: '3'
    },
    {
      id: '2000002',
      status: 'SUCCESS',
      date: '2024-11-16T12:00:00Z',
      filename: 'index.js',
      input: '12',
      output: 'console.log(7)'
    },
    {
      id: '2000003',
      status: 'ERROR',
      date: '2024-11-14T16:45:00Z',
      filename: 'main.js',
      input: '13',
      output: 'Error: Cannot find module'
    }
  ];

  for (const item of historyMock) {
    historyList.create(item);
  }
};

insertHistory();

// Lotus History 목록 조회
export const getHistoryList = async ({
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
  const { data, maxPage: max } = await historyList.findMany({ page });
  const list = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return HttpResponse.json({
    list,
    page: {
      current: page,
      max
    }
  });
};

// 코드 실행
interface PostCodeRunBody {
  input?: string;
  execFileName: string;
}

export const postCodeRun = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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
    input: body?.input ?? '',
    output: ''
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
export const getHistory = async ({ params }: { params: PathParams }) => {
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

// 태그 조회
export const getTagList = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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

export const postTag = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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
