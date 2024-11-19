import { IsString } from 'class-validator';

export class SimpleTagResponseDto {
  @IsString()
  tagName: string;
}
