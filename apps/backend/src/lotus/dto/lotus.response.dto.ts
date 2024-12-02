import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString, IsUrl, ValidateNested } from 'class-validator';
import { SimpleUserResponseDto } from './simple.user.response.dto';
import { Lotus } from '@/lotus/lotus.entity';
import { Tag } from '@/tag/tag.entity';

export class LotusResponseDto {
  @IsString()
  @ApiProperty({
    example: '25'
  })
  id: string;

  @IsString()
  @ApiProperty({
    example: '로투스 제목1'
  })
  title: string;

  @IsBoolean()
  @ApiProperty({
    example: true
  })
  isPublic: boolean;

  @IsString()
  @ApiProperty({
    example: 'JavaScript'
  })
  language: string;

  @IsUrl()
  @ApiProperty({
    example: 'https://gist.github.com/gistId~~/commitId~~'
  })
  gistUrl: string;

  @IsDate()
  @ApiProperty({
    example: '로투스 생성 일시'
  })
  date: Date;

  @ValidateNested()
  @Type(() => SimpleUserResponseDto)
  @ApiProperty({
    type: SimpleUserResponseDto
  })
  author: SimpleUserResponseDto;

  @ApiProperty({
    example: ['Web', 'Be']
  })
  tags: string[];

  static ofSpreadData(user: SimpleUserResponseDto, lotus: Lotus, tags: string[]): LotusResponseDto {
    return {
      id: lotus.lotusId,
      author: user,
      title: lotus.title,
      language: lotus.language,
      gistUrl: `https://gist.github.com/${lotus.gistRepositoryId}/${lotus.commitId}`,
      isPublic: lotus.isPublic,
      date: lotus.createdAt,
      tags
    };
  }

  static ofLotus(lotus: Lotus): LotusResponseDto {
    const simpleUser = SimpleUserResponseDto.ofUserDto(lotus.user);
    const tags = lotus.tags.map((tag) => tag.tag.tagName);
    return {
      id: lotus.lotusId,
      author: simpleUser,
      title: lotus.title,
      gistUrl: `https://gist.github.com/${lotus.gistRepositoryId}/${lotus.commitId}`,
      language: lotus.language,
      isPublic: lotus.isPublic,
      date: lotus.createdAt,
      tags
    };
  }
}
