import { ApiProperty } from '@nestjs/swagger';
import { HistoryPublicDto } from './history.pulbic.dto';
import { History } from '@/history/history.entity';

export class HistoryResponseListDto {
  @ApiProperty({
    type: [HistoryPublicDto]
  })
  list: HistoryPublicDto[];
  @ApiProperty({
    type: Object,
    example: { current: 1, max: 10 }
  })
  page: {
    current: number;
    max: number;
  };

  static of(historys: History[], page: number, size: number, total: number) {
    return {
      list: historys.map((history) => HistoryPublicDto.of(history)),
      page: {
        current: page,
        max: Math.ceil(total / size)
      }
    };
  }
}
