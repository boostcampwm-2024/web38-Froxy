import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotusController } from './lotus.controller';
import { Lotus } from './lotus.entity';
import { LotusRepository } from './lotus.repository';
import { LotusService } from './lotus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lotus])],
  controllers: [LotusController],
  providers: [LotusService, LotusRepository],
  exports: [LotusService, LotusRepository]
})
export class LotusModule {}
