import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { LotusTag } from './lotus.tag.entity';

@Injectable()
export class LotusTagRepository extends Repository<LotusTag> {
  constructor(private dataSource: DataSource) {
    super(LotusTag, dataSource.createEntityManager());
  }
}
