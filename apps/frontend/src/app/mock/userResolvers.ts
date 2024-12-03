import { DefaultBodyType, HttpResponse, StrictRequest } from 'msw';

const MOCK_CODE = 'mock-code';
const MOCK_UUID = 'mock-uuid';

// github 사용자 기본 정보 조회 api
export const getUserInfo = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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

  return HttpResponse.json({
    id: '1',
    nickname: 'mockUser',
    profile: '/image/exampleImage.jpeg',
    gistUrl: 'https://github.com'
  });
};

// 사용자 프로필 수정 api - 일단 닉네임만 수정되도록
interface UserPatchRequestBody {
  nickname: string;
  profile?: File;
}

export const patchUserInfo = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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
    const body = (await request.json()) as UserPatchRequestBody;

    if (!body.nickname) throw new Error('body 형식이 올바르지 않음');

    return HttpResponse.json({
      nickname: body.nickname,
      profile: `https://github.com/${body.nickname}`
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

// 로그인 api
export const getLogin = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code !== MOCK_CODE)
    return new HttpResponse('Unauthorized: Invalid or missing code', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

  return HttpResponse.json({
    token: MOCK_UUID
  });
};

// 로그아웃 api
export const logout = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const authorization = request.headers.get('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new HttpResponse('Unauthorized: Invalid or missing token', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  return HttpResponse.json({
    message: '로그아웃 성공!'
  });
};
