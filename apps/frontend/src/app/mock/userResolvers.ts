import { DefaultBodyType, HttpResponse, StrictRequest } from 'msw';
import { MockRepository } from './MockRepository';
import { UserDto } from '@/feature/user';

const MOCK_CODE = 'mock-code';
const MOCK_UUID = 'mock-uuid';

const userList = new MockRepository<Omit<UserDto, 'id'>>();

const insertUser = () => {
  const userMock: UserDto = {
    id: '1',
    nickname: 'mockUser',
    profile: '/image/exampleImage.jpeg',
    gistUrl: 'https://github.com'
  };

  userList.create(userMock);
};

insertUser();

// github 사용자 기본 정보 조회 api
export const getUserInfo = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
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

  const user = await userList.findOne({ id: '0' });

  return HttpResponse.json(user);
};

// 사용자 프로필 수정 api - 일단 닉네임만 수정되도록

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
    const body = (await request.json()) as Partial<UserDto>;

    const user = await userList.findOne({ id: '0' });

    const updatedUser = await userList.update(user, body);

    return HttpResponse.json(updatedUser);
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
