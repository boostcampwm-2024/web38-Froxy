import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @ApiProperty({
    example: 'ok'
  })
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}
