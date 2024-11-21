import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseGistDto {
  @IsString()
  @ApiProperty({
    example: '12asdfll2j3'
  })
  gistId: string;

  @IsString()
  @ApiProperty({
    example: 'gist 제목23'
  })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'nickname12'
  })
  nickname: string;

  static of(gist: any): ResponseGistDto {
    return {
      gistId: gist.id,
      title: gist.description,
      nickname: gist.owner.login
    };
  }
}
