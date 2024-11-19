import { IsString } from 'class-validator';

export class TokenDTO {
  @IsString()
  token: string;

  static of(token: string): TokenDTO {
    return { token };
  }
}
