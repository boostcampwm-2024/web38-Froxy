import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { ResponseGistDto } from './response.gist.dto';

export class ResponseAllGistsDto {
  @IsNumber()
  @ApiProperty({
    example: 1
  })
  page: number;

  @IsNumber()
  @ApiProperty({
    example: 10
  })
  size: number;

  @IsBoolean()
  @ApiProperty({
    example: false
  })
  hasNextPage: boolean;

  @ValidateNested({ each: true })
  @Type(() => ResponseGistDto)
  @ApiProperty({
    type: [ResponseGistDto]
  })
  gists: ResponseGistDto[];

  static of(gists: ResponseGistDto[], page: number, hasNextPage: boolean) {
    return {
      gists: gists,
      page: page,
      size: gists.length,
      hasNextPage: hasNextPage
    };
  }
}
