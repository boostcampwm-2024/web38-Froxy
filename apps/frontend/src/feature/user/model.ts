export interface UserDto {
  id: string;
  nickname: string;
  profile: string;
  gistUrl: string;
}

export class UserModel {
  public id: string;
  public nickname: string;
  public profile: string;
  public gistUrl: string;

  constructor(dto: UserDto) {
    this.id = dto.id;
    this.nickname = dto.nickname;
    this.profile = dto.profile || '/image/logoIcon.svg';
    this.gistUrl = dto.gistUrl;
  }
}
