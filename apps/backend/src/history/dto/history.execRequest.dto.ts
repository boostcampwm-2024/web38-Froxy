import { IsArray, IsString } from 'class-validator';

export class HistoryExecRequestDto {
  @IsArray()
  input: string[];

  @IsString()
  execFileName: string;
}
