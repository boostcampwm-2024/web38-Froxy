import { LotusResponseDto } from './lotus.response.dto';
import { PageDto } from './page.dto';
import { Lotus } from '@/lotus/lotus.entity';

export class LotusPublicDto {
  lotuses: LotusResponseDto[];
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
