import { DefaultBodyType, HttpResponse, PathParams, StrictRequest } from 'msw';
import { historyRepository } from '@/app/mock/repository/historyRepository';

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
  const { data, maxPage: max } = await historyRepository.findMany({ page });
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

  const newHistory = await historyRepository.create({
    filename: body.execFileName,
    date: new Date().toISOString(),
    status: 'PENDING',
    input: body?.input ?? '',
    output: ''
  });

  setTimeout(() => {
    historyRepository.update(
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

  const history = await historyRepository.findOne({ id: historyId as string });

  return HttpResponse.json(history);
};
