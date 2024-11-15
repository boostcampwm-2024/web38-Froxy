export class ResponseGistDto {
  gist_id: string;
  title: string;
  nickname: string;

  static of(gist: any): ResponseGistDto {
    return {
      gist_id: gist.id,
      title: gist.description,
      nickname: gist.owner.login
    };
  }
}
