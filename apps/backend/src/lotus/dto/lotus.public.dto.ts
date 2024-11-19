import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LotusResponseDto } from './lotus.response.dto';
import { PageDto } from './page.dto';
import { Lotus } from '@/lotus/lotus.entity';

export class LotusPublicDto {
  @ValidateNested({ each: true })
  @Type(() => LotusResponseDto)
  @ApiProperty({
    type: [LotusResponseDto]
  })
  lotuses: LotusResponseDto[];

  @ValidateNested()
  @Type(() => PageDto)
  @ApiProperty({
    type: PageDto
  })
  page: PageDto;

  static ofLotusList(lotusList: Lotus[], idx: number, maxV: number): LotusPublicDto {
    const returnLotusList = lotusList.map((lotus) => LotusResponseDto.ofLotus(lotus));
    const pageData = PageDto.ofNumbers(idx, maxV);
    return {
      lotuses: returnLotusList,
      page: pageData
    };
  }
}
