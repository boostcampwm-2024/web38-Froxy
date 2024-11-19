import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { ResponseGistDto } from './response.gist.dto';

export class ResponseAllGistsDto {
  @IsNumber()
  page: number;

  @IsNumber()
  size: number;

  @IsBoolean()
  hasNextPage: boolean;

  @ValidateNested({ each: true })
  @Type(() => ResponseGistDto)
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
