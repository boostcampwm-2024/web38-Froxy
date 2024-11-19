import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString, ValidateNested } from 'class-validator';
import { SimpleTagResponseDto } from './simple.tag.response.dto';
import { SimpleUserResponseDto } from './simple.user.response.dto';
import { Lotus } from '@/lotus/lotus.entity';

export class LotusResponseDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsBoolean()
  isPublic: boolean;

  @IsString()
  language: string;

  @IsDate()
  date: Date;

  @ValidateNested()
  @Type(() => SimpleUserResponseDto)
  author: SimpleUserResponseDto;

  @ValidateNested({ each: true })
  @Type(() => SimpleTagResponseDto)
  tags: SimpleTagResponseDto[];

  static ofSpreadData(user: SimpleUserResponseDto, lotus: Lotus): LotusResponseDto {
    return {
      id: lotus.lotusId,
      author: user,
      title: lotus.title,
      language: lotus.language,
      isPublic: lotus.isPublic,
      date: lotus.createdAt,
      tags: lotus.category
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
      tags: lotus.category
    };
  }
}
