import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }
  // 이름 일부로 태그 찾기
  async searchTagName(tagName: string): Promise<Tag[]> {
    return await this.find({ where: { tagName: Like(`%${tagName}%`) } });
  }
}
