import { Test, TestingModule } from '@nestjs/testing';
import { GistController } from './gist.controller';
import { GistService } from './gist.service';

describe('GistController', () => {
  let controller: GistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GistController],
      providers: [GistService],
    }).compile();

    controller = module.get<GistController>(GistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
