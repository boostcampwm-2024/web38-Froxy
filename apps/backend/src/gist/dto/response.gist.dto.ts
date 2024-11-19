import { IsString } from 'class-validator';

export class ResponseGistDto {
  @IsString()
  gist_id: string;

  @IsString()
  title: string;

  @IsString()
  nickname: string;

  static of(gist: any): ResponseGistDto {
    return {
      gist_id: gist.id,
      title: gist.description,
      nickname: gist.owner.login
    };
  }
}
