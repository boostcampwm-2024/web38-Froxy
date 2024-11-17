import { SimpleTagResponseDto } from './simple.tag.response.dto';
import { SimpleUserResponseDto } from './simple.user.response.dto';
import { Lotus } from '@/lotus/lotus.entity';

export class CreateLotusDto {
  id: string;
  user: SimpleUserResponseDto;
  title: string;
  isPublic: boolean;
  createAt: Date;
  tag: SimpleTagResponseDto[];

  static ofSpreadData(user: SimpleUserResponseDto, lotus: Lotus): CreateLotusDto {
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
