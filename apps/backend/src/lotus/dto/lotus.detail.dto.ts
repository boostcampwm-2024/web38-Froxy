import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsString, ValidateNested } from 'class-validator';
import { SimpleFileResponseDto } from './simple.file.response.dto';
import { SimpleUserResponseDto } from './simple.user.response.dto';
import { GistApiFileListDto } from '@/gist/dto/gistApiFileList.dto';
import { Lotus } from '@/lotus/lotus.entity';

export class LotusDetailDto {
  @IsString()
  @ApiProperty({
    example: '7'
  })
  id: string;

  @IsString()
  @ApiProperty({
    example: 'test Lotus 제목'
  })
  title: string;

  @IsArray()
  @ApiProperty({
    example: ['Web', 'FE']
  })
  tags: string[];

  @IsDate()
  @ApiProperty({
    example: 'lotus 생성 날짜'
  })
  date: Date;

  @IsString()
  @ApiProperty({
    example: 'JavaScript'
  })
  language: string;

  @IsString()
  @ApiProperty({
    example: 'NodeJs:v22.11.0'
  })
  version: string;

  @IsBoolean()
  @ApiProperty({
    example: true
  })
  isPublic: boolean;

  @ValidateNested()
  @Type(() => SimpleUserResponseDto)
  @ApiProperty({
    type: SimpleUserResponseDto
  })
  author: SimpleUserResponseDto;

  @ValidateNested({ each: true })
  @Type(() => SimpleFileResponseDto)
  @ApiProperty({
    type: [SimpleFileResponseDto]
  })
  files: SimpleFileResponseDto[];

  static ofGistFileListDto(gistFileList: GistApiFileListDto, lotus: Lotus): LotusDetailDto {
    const simpleFiles: SimpleFileResponseDto[] = gistFileList.files.map((file) =>
      SimpleFileResponseDto.ofFileApiDto(file)
    );
    const simpleUser: SimpleUserResponseDto = SimpleUserResponseDto.ofUserDto(lotus.user);
    const simpleTags: string[] = lotus.tags.map((tag) => tag.tagName);
    return {
      id: lotus.lotusId,
      title: lotus.title,
      language: lotus.language,
      version: lotus.version,
      date: lotus.createdAt,
      isPublic: lotus.isPublic,
      tags: simpleTags,
      author: simpleUser,
      files: simpleFiles
    };
  }
}
