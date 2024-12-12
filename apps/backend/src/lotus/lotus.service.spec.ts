import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LotusPublicDto } from './dto/lotus.public.dto';
import { Lotus } from './lotus.entity';
import { LotusRepository } from './lotus.repository';
import { LotusService } from './lotus.service';
import { mockLotusData, mockLotusTag, mockUser } from './mockLotusData';
import { GistService } from '@/gist/gist.service';
import { LotusTagService } from '@/relation/lotus.tag.service';
import { UserService } from '@/user/user.service';

describe('Lotus Service', () => {
  let service: LotusService;

  const mockLotusRepository = {
    findAndCount: jest.fn((criteria) => {
      const { where } = criteria;
      const filteredData = mockLotusData.filter((lotus) => {
        return Object.keys(where).every((key) => {
          const condition = where[key];
          if (typeof condition === 'object' && condition.constructor.name === 'FindOperator') {
            if (condition.type === 'in') {
              return condition.value.includes(lotus);
            } else {
              const value = condition.value;
              const searchValue = value.replace(/%/g, '');
              return lotus[key].includes(searchValue);
            }
          } else if (typeof condition === 'object') {
            return Object.keys(condition).every((valueKey) => {
              return lotus[key][valueKey] === condition[valueKey];
            });
          }
          return lotus[key] === where[key];
        });
      });
      return Promise.resolve([filteredData, filteredData.length]);
    }),
    exists: jest.fn((criteria) => {
      const { where } = criteria;
      const validData = mockLotusData.filter((lotus) => {
        if (lotus.gistRepositoryId === where['gistRepositoryId'] && lotus.commitId === where['commitId']) {
          return true;
        }
        return false;
      });
      if (validData.length > 0) return true;
      else return false;
    }),
    save: jest.fn((criteria) => {
      criteria['lotusId'] = '6';
      mockLotusData.push(criteria);
    }),
    findOne: jest.fn((criteria) => {
      const { where } = criteria;
      const validData = mockLotusData.filter((lotus) => {
        if (lotus.gistRepositoryId === where['gistRepositoryId'] && lotus.commitId === where['commitId']) {
          return true;
        }
        if (lotus.lotusId === where['lotusId']) {
          return true;
        }
        return false;
      });
      if (validData.length > 0) return validData[0];
      else return null;
    })
  };

  const mockUserService = { findOneByUserId: jest.fn(() => mockUser[1]) };
  const mockGistService = { getCommitsForAGist: jest.fn(() => ['commitData3', 'commitData2', 'commitData1']) };
  const mockLotusTagService = {
    searchTag: jest.fn((search) => {
      return mockLotusTag
        .filter((lotusTag) => {
          return lotusTag.tag.tagName.includes(search);
        })
        .map((data) => data.lotus);
    })
    // updateRelation:jest.fn(async (lotus: Lotus, tagNames: string[]) => {
    //   const data = await Promise.all(
    //     tagNames.map(async (tag) => {
    //       return await this.getLotusTagRelation(lotus, tag);
    //     })
    //   );
    //   const tagIds = data.map((tag) => tag.tag.tagId);
    //   await this.lotusTagRepository.delete({
    //     lotus: { lotusId: lotus.lotusId },
    //     tag: { tagId: Not(In(tagIds)) }
    //   });

    //   await this.tagService.deleteNoRelationTags(await this.findUsingTags());
    // })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LotusService,
        {
          provide: LotusRepository,
          useValue: mockLotusRepository
        },
        {
          provide: GistService,
          useValue: mockGistService
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: LotusTagService,
          useValue: mockLotusTagService
        }
      ]
    }).compile();
    service = module.get<LotusService>(LotusService);
    mockLotusData.forEach((lotus) => {
      lotus.tags = mockLotusTag.filter((relation) => {
        return relation.lotus === lotus;
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find public lotus data', () => {
    it('should return all lotuses', async () => {
      const lotuses = await service.getPublicLotus(1, 5, '');
      expect(lotuses).toEqual(
        LotusPublicDto.ofLotusList(
          mockLotusData.filter((lotus) => {
            return lotus.isPublic;
          }),
          1,
          1
        )
      );
    });
    it('should return public lotuses included "hi" in title', async () => {
      const pattern = /hi/;
      const lotuses = await service.getPublicLotus(1, 5, 'hi');
      expect(lotuses).toEqual(
        LotusPublicDto.ofLotusList(
          mockLotusData.filter((lotus) => {
            return lotus.isPublic && pattern.test(lotus.title);
          }),
          1,
          1
        )
      );
    });
    it('should return empty array', async () => {
      const pattern = /Empty Test/;
      const lotuses = await service.getPublicLotus(1, 5, 'Empty Test');
      expect(lotuses).toEqual(
        LotusPublicDto.ofLotusList(
          mockLotusData.filter((lotus) => {
            return lotus.isPublic && pattern.test(lotus.title);
          }),
          1,
          0
        )
      );
    });
  });

  describe('find user lotus data by tag', () => {
    it('should return public lotuses included "Java" in tag', async () => {
      const pattern = /Java/;
      const [lotuses, number] = await service.getLotusByTags(1, 5, 'Java');
      expect(lotuses).toEqual(
        mockLotusTag
          .filter((relation) => {
            return relation.lotus.isPublic && pattern.test(relation.tag.tagName);
          })
          .map((data) => data.lotus)
          .filter((lotus, index, self) => index === self.findIndex((t) => t.lotusId === lotus.lotusId))
      );
    });
    it('should return public lotuses included "Script" in tag', async () => {
      const pattern = /Script/;
      const [lotuses, number] = await service.getLotusByTags(1, 5, 'Script');
      expect(lotuses).toEqual(
        mockLotusTag
          .filter((relation) => {
            return relation.lotus.isPublic && pattern.test(relation.tag.tagName);
          })
          .map((data) => data.lotus)
          .filter((lotus, index, self) => index === self.findIndex((t) => t.lotusId === lotus.lotusId))
      );
    });
    it('should return empty array', async () => {
      const pattern = /Empty Test/;
      const [lotuses, number] = await service.getLotusByTags(1, 5, 'Empty Test');
      expect(lotuses).toEqual([]);
    });
  });

  describe('find user lotus data', () => {
    it('should return all lotuses of mockUser2', async () => {
      const lotuses = await service.getUserLotus('2', 1, 5);
      expect(lotuses).toEqual(
        LotusPublicDto.ofLotusList(
          mockLotusData.filter((lotus) => {
            return lotus.user === mockUser[1];
          }),
          1,
          1
        )
      );
    });
  });

  describe('create new lotus', () => {
    it('create success', async () => {
      const lotus = await service.createLotus('2', 'mockGitToken2', {
        title: 'new lotus',
        isPublic: true,
        tags: [],
        gistUuid: '7a7b08c72fff21b48464c78589f26ae4',
        language: 'JavaScript',
        version: 'NodeJs:v22.11.0'
      });
      expect(lotus.id).toEqual('6');
      expect(lotus.author.id).toEqual('2');
      expect(lotus.title).toEqual('new lotus');
    });
    it('no gist commit data', async () => {
      const noCommitData: string[] = [];
      mockGistService.getCommitsForAGist.mockImplementationOnce(() => noCommitData);
      const lotus = service.createLotus('2', 'mockGitToken2', {
        title: 'new lotus',
        isPublic: true,
        tags: [],
        gistUuid: '7a7b08c72fff21b48464c78589f26ae4',
        language: 'JavaScript',
        version: 'NodeJs:v22.11.0'
      });
      expect(lotus).rejects.toThrowError(new HttpException('gistId is not exist', HttpStatus.NOT_FOUND));
    });
    it('already exist the same gist&commit', async () => {
      const lotus = service.createLotus('2', 'mockGitToken2', {
        title: 'new lotus',
        isPublic: true,
        tags: [],
        gistUuid: '7a7b08c72fff21b48464c78589f26ae4',
        language: 'JavaScript',
        version: 'NodeJs:v22.11.0'
      });
      expect(lotus).rejects.toThrowError(new HttpException('same commit Lotus already exist.', HttpStatus.CONFLICT));
    });
  });

  // describe('update lotus', () => {
  //   it('update success(public toggle)', async () => {
  //     service.updateLotus(
  //       '6',
  //       {
  //         title: undefined,
  //         tags: undefined,
  //         isPublic: false
  //       },
  //       '2'
  //     );
  //   });
  //   it('update success(title, tags)', async () => {
  //     service.updateLotus(
  //       '6',
  //       {
  //         title: 'update Lotus',
  //         tags: ['JavaScript'],
  //         isPublic: undefined
  //       },
  //       '2'
  //     );
  //   });
  // });
});
