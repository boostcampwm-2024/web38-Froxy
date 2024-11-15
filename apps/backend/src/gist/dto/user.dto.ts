export class UserDto {
  login: string;
  id: number;
  avatarUrl: string;

  static of(gistOwner: any): UserDto {
    return {
      login: gistOwner.login,
      id: gistOwner.id,
      avatarUrl: gistOwner.avatar_url
    };
  }
}
