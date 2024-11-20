import { IsString } from 'class-validator';
import { GistApiFileDto } from '@/gist/dto/gistApiFile.dto';

export class FileDto {
  @IsString()
  filename: string;

  @IsString()
  language: string;

  @IsString()
  content: string;
  static ofGistApiFile(file: GistApiFileDto): FileDto {
    return { filename: file.fileName, language: file.language, content: file.content };
  }
}
