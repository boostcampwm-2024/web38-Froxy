import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Like } from 'typeorm';
import { TagSearchResponseDTO } from './dto/tag.searchResponse.dto';
import { Tag } from './tag.entity';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async createTag(tagName: string): Promise<any> {
    try {
      const isExistTag = await this.tagRepository.findOne({ where: { tagName } });
      if (isExistTag) {
        throw new HttpException('이미 존재하는 태그입니다.', HttpStatus.BAD_REQUEST);
      }
      await this.tagRepository.save({
        tagName: tagName
      });
      return { message: `${tagName} 생성` };
    } catch (error) {
      throw new HttpException('태그 생성 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTag(tagName: string): Promise<Tag> {
    let tag = await this.tagRepository.findOne({ where: { tagName } });
    if (!tag) {
      await this.createTag(tagName);
      tag = await this.tagRepository.findOne({ where: { tagName } });
    }
    return tag;
  }

  async serachTag(tagName: string): Promise<Tag[]> {
    const tags = await this.tagRepository.searchTagName(tagName);

    return tags;
  }
}
