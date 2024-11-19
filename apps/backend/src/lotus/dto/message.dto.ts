import { IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}
