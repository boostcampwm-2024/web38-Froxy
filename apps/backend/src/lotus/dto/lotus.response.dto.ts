import { SimpleTagResponseDto } from './simple.tag.response.dto';
import { SimpleUserResponseDto } from './simple.user.response.dto';
import { Lotus } from '@/lotus/lotus.entity';

export class LotusResponseDto {
  id: string;
  author: SimpleUserResponseDto;
  title: string;
  isPublic: boolean;
  language: string;
  date: Date;
  tag: SimpleTagResponseDto[];

  static ofSpreadData(user: SimpleUserResponseDto, lotus: Lotus): LotusResponseDto {
    return {
      id: lotus.lotusId,
      author: user,
      title: lotus.title,
      language: lotus.language,
      isPublic: lotus.isPublic,
      date: lotus.createdAt,
      tag: lotus.category
    };
  }

  static ofLotus(lotus: Lotus): LotusResponseDto {
    const simpleUser = SimpleUserResponseDto.ofUserDto(lotus.user);
    return {
      id: lotus.lotusId,
      author: simpleUser,
      title: lotus.title,
      language: lotus.language,
      isPublic: lotus.isPublic,
      date: lotus.createdAt,
      tag: lotus.category
    };
  }
}
