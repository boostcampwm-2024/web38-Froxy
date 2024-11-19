import { IsString } from 'class-validator';
import { GistApiFileDto } from '@/gist/dto/gistApiFile.dto';

export class SimpleFileResponseDto {
  @IsString()
  filename: string;

  @IsString()
  language: string;

  @IsString()
  content: string;

  static ofFileApiDto(fileApiDto: GistApiFileDto) {
    return {
      filename: fileApiDto.fileName,
      language: fileApiDto.language,
      content: fileApiDto.content
    };
  }
}
