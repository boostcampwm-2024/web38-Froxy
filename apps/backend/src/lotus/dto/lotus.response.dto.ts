import { SimpleTagResponseDto } from './simple.tag.response.dto';
import { SimpleUserResponseDto } from './simple.user.response.dto';
import { Lotus } from '@/lotus/lotus.entity';

export class LotusResponseDto {
  id: string;
  user: SimpleUserResponseDto;
  title: string;
  isPublic: boolean;
  createAt: Date;
  tag: SimpleTagResponseDto[];

  static ofSpreadData(user: SimpleUserResponseDto, lotus: Lotus): LotusResponseDto {
    return {
      id: lotus.lotusId,
      user,
      title: lotus.title,
      isPublic: lotus.isPublic,
      createAt: lotus.createdAt,
      tag: lotus.category
    };
  }

  static ofLotus(lotus: Lotus): LotusResponseDto {
    const simpleUser = SimpleUserResponseDto.ofUserDto(lotus.user);
    return {
      id: lotus.lotusId,
      user: simpleUser,
      title: lotus.title,
      isPublic: lotus.isPublic,
      createAt: lotus.createdAt,
      tag: lotus.category
    };
  }
}
