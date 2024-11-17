import { SimpleTagResponseDto } from './simple.tag.response.dto';
import { SimpleUserResponseDto } from './simple.user.response.dto';
import { Lotus } from '@/lotus/lotus.entity';

export class LotusCreateDto {
  id: string;
  user: SimpleUserResponseDto;
  title: string;
  isPublic: boolean;
  createAt: Date;
  tag: SimpleTagResponseDto[];

  static ofSpreadData(user: SimpleUserResponseDto, lotus: Lotus): LotusCreateDto {
    return {
      id: lotus.lotusId,
      user,
      title: lotus.title,
      isPublic: lotus.isPublic,
      createAt: lotus.createdAt,
      tag: []
    };
  }
}
