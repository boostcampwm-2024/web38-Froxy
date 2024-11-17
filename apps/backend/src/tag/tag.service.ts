import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}
  createTag(tagName: string): any {
    this.tagRepository.save({
      tagName: tagName
    });
    return { message: `${tagName} 생성` };
  }
}
