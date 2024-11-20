import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FileDto } from './file.dto';

export class FileResponseDto {
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  @ApiProperty({
    type: [FileDto]
  })
  files: FileDto[];
  static ofFiles(files: FileDto[]): FileResponseDto {
    return { files };
  }
}
