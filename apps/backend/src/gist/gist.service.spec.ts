import { Test, TestingModule } from '@nestjs/testing';
import { GistService } from './gist.service';

describe('GistService', () => {
  let service: GistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GistService],
    }).compile();

    service = module.get<GistService>(GistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
