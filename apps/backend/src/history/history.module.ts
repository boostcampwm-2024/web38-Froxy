import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryController } from './history.controller';
import { History } from './history.entity';
import { HistoryRepository } from './history.repository';
import { HistoryService } from './history.service';
import { DockerModule } from '@/docker/docker.module';
import { GistModule } from '@/gist/gist.module';
import { LotusModule } from '@/lotus/lotus.module';

@Module({
  imports: [TypeOrmModule.forFeature([History]), DockerModule, LotusModule, GistModule],
  controllers: [HistoryController],
  providers: [HistoryService, HistoryRepository],
  exports: [HistoryService, HistoryRepository]
})
export class HistoryModule {}
