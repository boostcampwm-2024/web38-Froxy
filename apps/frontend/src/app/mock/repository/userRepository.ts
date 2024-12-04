import { MockRepository } from '@/app/mock/MockRepository';
import { UserDto } from '@/feature/user';

export const MOCK_CODE = 'mock-code';
export const MOCK_UUID = 'mock-uuid';

export const userRepository = new MockRepository<Omit<UserDto, 'id'>>();

const insertUser = () => {
  const userMock: UserDto = {
    id: '1',
    nickname: 'mockUser',
    profile: '/image/exampleImage.jpeg',
    gistUrl: 'https://github.com'
  };

  userRepository.create(userMock);
};

insertUser();
