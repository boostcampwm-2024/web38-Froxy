import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { AuthService } from '@/auth/auth.service';
import { SimpleUserResponseDto } from '@/lotus/dto/simple.user.response.dto';
const testUserId = '1';

const mockUser = {
  userId: '1',
  nickname: 'testuser',
  profilePath: '/images/profile.png',
  gitToken: 'mock-token',
  gitId: 12345,
  gistUrl: 'https://gist.github.com/testUser',
  lotuses: [],
  comments: []
};

const mockMakeUserData = {
  login: 'testuser',
  avatar_url: '/images/profile.png',
  id: 12345
};

const mockUserAccessToken = 'mock-update-token';

const mockUserRepository = {
  findOne: jest.fn((criteria) => {
    if (criteria.userId) return Promise.resolve(mockUser.userId === criteria.userId ? mockUser : null);
    if (criteria.gitId) return Promise.resolve(mockUser.gitId === criteria.gitId ? mockUser : null);
    else return null;
  }),
  findOneBy: jest.fn((criteria) => {
    if (criteria.userId) return Promise.resolve(mockUser.userId === criteria.userId ? mockUser : null);
    if (criteria.gitId) return Promise.resolve(mockUser.gitId === criteria.gitId ? mockUser : null);
    else return null;
  }),
  update: jest.fn((criteria, updateData) => {
    if (criteria.userId && criteria.userId === mockUser.userId) {
      if (updateData.nickname) mockUser.nickname = updateData.nickname;
      if (updateData.profilePath) mockUser.profilePath = updateData.profilePath;
      return Promise.resolve({ affected: 1 });
    }
    if (criteria.gitId && criteria.gitId === mockUser.gitId) {
      if (updateData.gitToken) mockUser.gitToken = updateData.gitToken;
      return Promise.resolve({ affected: 1 });
    }
    return Promise.resolve({ affected: 0 });
  }),
  create: jest.fn((user) => {
    mockUser['userId'] = '1';
    mockUser['nickname'] = user.nickname;
    mockUser['profilePath'] = user.profilePath;
    mockUser['gitToken'] = user.gitToken;
    mockUser['gitId'] = user.gitId;
    mockUser['gistUrl'] = user.gistUrl;
    mockUser['lotuses'] = user.lotuses;
    mockUser['comments'] = user.comments;
  }),
  save: jest.fn((user) => {
    mockUser['userId'] = '1';
    mockUser['nickname'] = user.nickname;
    mockUser['profilePath'] = user.profilePath;
    mockUser['gitToken'] = user.gitToken;
    mockUser['gitId'] = user.gitId;
    mockUser['gistUrl'] = user.gistUrl;
    mockUser['lotuses'] = user.lotuses;
    mockUser['comments'] = user.comments;
  })
};

const mockAuthService = {
  createJwt: jest.fn((userId) => {
    return userId;
  })
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();
    mockUser['nickname'] = 'testuser';
    mockUser['profilePath'] = '/images/profile.png';
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find user data', () => {
    it('should return Mock user data', async () => {
      const user = await service.getSimpleUserInfoByUserId(testUserId);
      expect(user).toEqual(SimpleUserResponseDto.ofUserDto(mockUser));
    });
    it('should return Error', async () => {
      const user = service.getSimpleUserInfoByUserId('0');
      expect(user).rejects.toThrowError(new HttpException('user data is not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('update user data', () => {
    const updateData = { nickname: 'update', profile: '/images/update.png' };
    it('should return Mock user data', async () => {
      const user = await service.patchUserDataByUserId(testUserId, updateData);
      expect(user).toEqual(updateData);
    });
    it('should return Error', async () => {
      const user = service.patchUserDataByUserId('0', updateData);
      expect(user).rejects.toThrowError(new HttpException('user info not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('find gist token with userId', () => {
    it('should return Mock user data', async () => {
      const token = await service.findUserGistToken(testUserId);
      expect(token).toEqual(mockUser.gitToken);
    });
    it('should return Error', async () => {
      await expect(service.findUserGistToken('0')).rejects.toThrowError(
        new HttpException('user data not found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('login user', () => {
    it('already exist user', async () => {
      const userId = await service.makeUser(mockMakeUserData, mockUserAccessToken);
      expect(userId).toEqual(mockUser.userId);
      expect(mockUser.gitToken).toEqual(mockUserAccessToken);
    });
    it('new user', async () => {
      mockUser['userId'] = undefined;
      mockUser['nickname'] = undefined;
      mockUser['profilePath'] = undefined;
      mockUser['gitToken'] = undefined;
      mockUser['gitId'] = undefined;
      mockUser['gistUrl'] = undefined;
      mockUser['lotuses'] = undefined;
      mockUser['comments'] = undefined;
      const userId = await service.makeUser(mockMakeUserData, mockUserAccessToken);
      expect(userId).toEqual(mockUser.userId);
      expect(mockUser.gitToken).toEqual(mockUserAccessToken);
    });
  });
});
