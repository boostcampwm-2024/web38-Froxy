import { IsString } from 'class-validator';
export class TagCreateRequestDto {
  @IsString()
  tag: string;
}
