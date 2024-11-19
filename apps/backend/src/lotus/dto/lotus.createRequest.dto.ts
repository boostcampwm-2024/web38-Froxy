import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class LotusCreateRequestDto {
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

  @ApiProperty({
    example: ['Web', 'BE']
  })
  tags: string[];

  @IsString()
  @ApiProperty({
    example: '7a7b08c72fff21b48464c78589f26ae4'
  })
  gistUuid: string;

  @ApiProperty({
    example: 'JavaScript'
  })
  language: string;

  @ApiProperty({
    example: 'NodeJs:v22.11.0'
  })
  version: string;
}
