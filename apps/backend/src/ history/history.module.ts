import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  controllers: [],
  providers: []
})
export class HistoryModule {}
