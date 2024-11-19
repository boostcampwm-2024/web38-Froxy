
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class HistoryExecRequestDto {
  @ApiProperty({
    example: '[1 1 1 1, 1 1 1 1, 1 1 1 1, 1 1 1 1]'
  })
  @IsArray()
  input: string[];
  @ApiProperty({
    example: 'FunctionDivide.js'
  })
  @IsString()
  execFileName: string;
}
