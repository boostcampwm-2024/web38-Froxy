import { DefaultBodyType, HttpResponse, PathParams, StrictRequest } from 'msw';
import { lotusMockFileData, lotusRepository } from '@/app/mock/repository/lotusRepository';
import { userRepository } from '@/app/mock/repository/userRepository';
import { LotusDto } from '@/feature/lotus';

const MOCK_UUID = 'mock-uuid';

// 사용자의 Lotus 목록 조회
export const getUserLotusList = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const authorization = request.headers.get('Authorization');

  const [type, token] = authorization?.split(' ') || [];

  if (token !== MOCK_UUID || type !== 'Bearer') {
    return new HttpResponse('Unauthorized: Invalid or missing token', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 5;

  const { data: lotuses, maxPage: max } = await lotusRepository.findMany({ page, size });

  return HttpResponse.json({
    lotuses,
    page: {
      current: page,
      max
    }
  });
};

// public lotus 목록 조회
export const getPublicLotusList = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 5;
  const search = url.searchParams.get('search') || '';

  const { data: lotuses, maxPage: max } = await lotusRepository.search({
    query: { title: search, isPublic: true },
    page,
    size
  });

  return HttpResponse.json({
    lotuses,
    page: {
      current: page,
      max
    }
  });
};

// public lotus 상세 조회
export const getLotusDetail = async ({ params }: { params: Record<string, string> }) => {
  const lotusId = params.lotusId;

  const lotus = await lotusRepository.findOne({ id: lotusId });

  return HttpResponse.json({ ...lotus, ...lotusMockFileData });
};

type CreateLotusDto = {
  title: string;
  isPublic: false;
  tags: string[];
  gistUuid: string;
};

//lotus 생성
export const postCreateLotus = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const body = (await request.json()) as CreateLotusDto;

  const author = await userRepository.findOne({ id: '0' });

  const lotus = await lotusRepository.create({
    ...body,
    date: new Date().toISOString(),
    author,
    logo: '/image/exampleImage.jpeg',
    link: 'https://devblog.com/articles/1000000001',
    isPublic: false,
    gistUrl: ''
  });

  return HttpResponse.json(lotus);
};

// lotus 수정
export const patchLotus = async ({
  params,
  request
}: {
  params: PathParams;
  request: StrictRequest<DefaultBodyType>;
}) => {
  const { id } = params;

  const body = (await request.json()) as Partial<LotusDto>;

  if (!id || typeof id !== 'string') return HttpResponse.json({ message: 'id is required' });

  const lotus = await lotusRepository.findOne({ id });

  const updatedLotus = await lotusRepository.update(lotus, body);

  return HttpResponse.json(updatedLotus);
};

// lotus 삭제
export const deleteLotus = async ({ params }: { params: PathParams }) => {
  const { id } = params;

  if (!id || typeof id !== 'string') return HttpResponse.json({ message: 'id is required' });

  const lotus = await lotusRepository.findOne({
    id
  });

  await lotusRepository.delete(lotus);

  return HttpResponse.json(lotus);
};
