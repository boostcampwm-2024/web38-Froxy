import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Lotus } from './lotus.entity';

@Injectable()
export class TagRepository extends Repository<Lotus> {
  constructor(private dataSource: DataSource) {
    super(Lotus, dataSource.createEntityManager());
  }
}
