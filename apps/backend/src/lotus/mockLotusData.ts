import { Lotus } from '@/lotus/lotus.entity';
import { LotusTag } from '@/relation/lotus.tag.entity';
import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

// Mock User 생성
export const mockUser: User[] = [
  {
    userId: '1',
    nickname: 'test_user',
    profilePath: 'profile/path',
    gitToken: 'mockGitToken',
    gitId: 3215,
    gistUrl: 'http://gist.github.com/hihi',
    lotuses: [],
    comments: []
  },
  {
    userId: '2',
    nickname: 'another_user',
    profilePath: 'another/profile/path',
    gitToken: 'mockGitToken2',
    gitId: 4567,
    gistUrl: 'http://gist.github.com/hello',
    lotuses: [],
    comments: []
  }
];

const mockTags: Tag[] = [
  { tagId: '1', tagName: 'JavaScript', createdAt: new Date(), lotuses: [] },
  { tagId: '2', tagName: 'TypeScript', createdAt: new Date(), lotuses: [] }
];

export const mockLotusData: Lotus[] = [
  {
    lotusId: '1',
    title: 'hi lotus',
    isPublic: true,
    gistRepositoryId: 'gistRepo1',
    commitId: 'commitId1',
    language: 'JavaScript',
    version: '1.0.0',
    createdAt: new Date(),
    user: mockUser[0],
    comments: [],
    historys: [],
    tags: []
  },
  {
    lotusId: '2',
    title: 'height',
    isPublic: false,
    gistRepositoryId: 'gistRepo2',
    commitId: 'commitId2',
    language: 'TypeScript',
    version: '1.1.0',
    createdAt: new Date(),
    user: mockUser[1],
    comments: [],
    historys: [],
    tags: []
  },
  {
    lotusId: '3',
    title: 'Third high',
    isPublic: true,
    gistRepositoryId: 'gistRepo3',
    commitId: 'commitId3',
    language: 'Python',
    version: '1.2.0',
    createdAt: new Date(),
    user: mockUser[1],
    comments: [],
    historys: [],
    tags: []
  },
  {
    lotusId: '4',
    title: 'high mountain',
    isPublic: false,
    gistRepositoryId: 'gistRepo4',
    commitId: 'commitId4',
    language: 'Go',
    version: '1.3.0',
    createdAt: new Date(),
    user: mockUser[1],
    comments: [],
    historys: [],
    tags: []
  },
  {
    lotusId: '5',
    title: 'Fifth Lotus',
    isPublic: true,
    gistRepositoryId: 'gistRepo5',
    commitId: 'commitId5',
    language: 'Rust',
    version: '1.4.0',
    createdAt: new Date(),
    user: mockUser[1],
    comments: [],
    historys: [],
    tags: []
  }
];

export const mockLotusTag: LotusTag[] = [
  { lotusTagId: '1', lotus: mockLotusData[0], tag: mockTags[0] },
  { lotusTagId: '1', lotus: mockLotusData[1], tag: mockTags[1] },
  { lotusTagId: '1', lotus: mockLotusData[2], tag: mockTags[0] },
  { lotusTagId: '2', lotus: mockLotusData[2], tag: mockTags[1] }
];
