import { describe, expect, it } from 'vitest';
import { UserModel } from './model'; // 경로는 실제 파일 경로로 변경

describe('UserModel', () => {
  it.each([
    {
      description: '올바른 UserDto를 전달받으면 UserModel을 생성한다',
      userDto: {
        id: '123',
        nickname: 'testUser',
        profile: 'https://example.com/profile.png',
        gistUrl: 'https://gist.github.com/testUser'
      },
      expected: {
        id: '123',
        nickname: 'testUser',
        profile: 'https://example.com/profile.png',
        gistUrl: 'https://gist.github.com/testUser'
      }
    },
    {
      description: 'profile이 비어있는 UserDto를 전달받으면 기본 이미지를 사용하는 UserModel을 생성한다',
      userDto: {
        id: '456',
        nickname: 'defaultProfileUser',
        profile: '', // 비어있는 값
        gistUrl: 'https://gist.github.com/defaultProfileUser'
      },
      expected: {
        id: '456',
        nickname: 'defaultProfileUser',
        profile: '/image/logoIcon.svg', // 기본값
        gistUrl: 'https://gist.github.com/defaultProfileUser'
      }
    }
  ])('$description', ({ userDto, expected }) => {
    //Given
    const userModel = new UserModel(userDto);

    //When

    //Then
    expect(userModel).toEqual(expected);
  });
});
