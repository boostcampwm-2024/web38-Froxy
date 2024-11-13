import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lotus } from './lotus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lotus])],
  controllers: [],
  providers: []
})
export class LotusModule {}
