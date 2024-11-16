import { DefaultBodyType, HttpResponse, StrictRequest } from 'msw';

// github 사용자 기본 정보 조회 api
export const mockGetUserInfo = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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
    id: '1234567890',
    nickname: 'mockUser',
    profile: 'https://github.com/mockUser'
  });
};

// 사용자 프로필 수정 api - 일단 닉네임만 수정되도록
interface UserPatchRequestBody {
  nickname: string;
  profile?: File;
}

export const mockPatchUserInfo = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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
export const mockLogin = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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
    token: '가짜 토큰'
  });
};

// 로그아웃 api
export const mockLogout = ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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
