export class UserDto {
  login: string;
  id: number;
  avatar_url: string;

  constructor(login: string, id: number, avatar_url) {
    this.login = login;
    this.id = id;
    this.avatar_url = avatar_url;
  }
}
