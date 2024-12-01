import { Injectable } from '@nestjs/common';
import { In, Not } from 'typeorm';
import { LotusTagRepository } from './lotus.tag.repository';
import { Lotus } from '@/lotus/lotus.entity';
import { Tag } from '@/tag/tag.entity';
import { TagService } from '@/tag/tag.service';

@Injectable()
export class LotusTagService {
  constructor(private readonly lotusTagRepository: LotusTagRepository, private readonly tagService: TagService) {}

  async createLotusTagRelation(lotus: Lotus, tag: Tag) {
    await this.lotusTagRepository.save({ lotus, tag });
    return await this.lotusTagRepository.findOne({
      where: { lotus: { lotusId: lotus.lotusId }, tag: { tagId: tag.tagId } },
      relations: ['lotus', 'tag']
    });
  }

  async getLotusTagRelation(lotus: Lotus, tagName: string) {
    const tag = await this.tagService.getTag(tagName);
    let relation = await this.lotusTagRepository.findOne({
      where: { lotus: { lotusId: lotus.lotusId }, tag: { tagId: tag.tagId } },
      relations: ['lotus', 'tag']
    });
    if (!relation) {
      relation = await this.createLotusTagRelation(lotus, tag);
    }
    return relation;
  }

  async searchTag(search: string) {
    const tags = await this.tagService.searchTag(search);
    const lotusTags = await this.lotusTagRepository.find({
      where: { tag: In(tags) },
      relations: ['lotus']
    });
    return lotusTags.map((relation) => relation.lotus.lotusId);
  }

  async updateRelation(lotus: Lotus, tagNames: string[]) {
    const data = await Promise.all(
      tagNames.map(async (tag) => {
        return await this.getLotusTagRelation(lotus, tag);
      })
    );
    const tagIds = data.map((tag) => tag.tag.tagId);
    await this.lotusTagRepository.delete({
      lotus: { lotusId: lotus.lotusId },
      tag: { tagId: Not(In(tagIds)) }
    });

    await this.tagService.deleteNoRelationTags(await this.findUsingTags());
  }

  async findUsingTags() {
    const allData = await this.lotusTagRepository.find({ relations: ['tag'] });
    return allData.map((data) => data.tag.tagId);
  }
}
