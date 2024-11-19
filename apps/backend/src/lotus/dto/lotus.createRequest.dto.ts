import { IsArray, IsBoolean, IsString } from 'class-validator';

export class LotusCreateRequestDto {
  @IsString()
  title: string;

  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  tag: string[];

  @IsString()
  gistUuid: string;

  language: string;
  version: string;
}
