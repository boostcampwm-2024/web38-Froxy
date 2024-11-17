import { GistApiFileDto } from '@/gist/dto/gistApiFile.dto';

export class SimpleFileResponseDto {
  filename: string;
  language: string;
  content: string;

  static ofFileApiDto(fileApiDto: GistApiFileDto) {
    return {
      filename: fileApiDto.file_name,
      language: fileApiDto.language,
      content: fileApiDto.content
    };
  }
}
