import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotusTag } from './lotus.tag.entity';
import { LotusTagRepository } from './lotus.tag.repository';
import { LotusTagService } from './lotus.tag.service';
import { TagModule } from '@/tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([LotusTag]), TagModule],
  providers: [LotusTagService, LotusTagRepository],
  exports: [LotusTagService]
})
export class LotusTagModule {}
