import { ResponseGistDto } from './response.gist.dto';

export class ResponseAllGistsDto {
  gists: ResponseGistDto[];
  page: number;
  size: number;
  hasNextPage: boolean;
  static of(gists: ResponseGistDto[], page: number, hasNextPage: boolean) {
    return {
      gists: gists,
      page: page,
      size: gists.length,
      hasNextPage: hasNextPage
    };
  }
}
