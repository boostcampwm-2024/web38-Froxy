export class ResponseGistDto {
  gist_id: string;
  title: string;
  nickname: string;
  constructor(gist: any) {
    this.gist_id = gist.id;
    this.title = gist.description;
    this.nickname = gist.owner.login;
  }
}
