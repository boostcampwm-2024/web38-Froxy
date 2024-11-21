import { IsNumber, IsString } from 'class-validator';

export class GistApiFileDto {
  @IsString()
  fileName?: string;

  @IsString()
  rawUrl?: string;

  @IsString()
  type?: string;

  @IsString()
  language?: string;

  @IsNumber()
  size?: number;

  @IsString()
  content?: string;

  static of(fileName: string, data: any, content: string): GistApiFileDto {
    return {
      fileName: fileName,
      rawUrl: data.files[fileName].raw_url,
      type: data.files[fileName].type,
      language: data.files[fileName].language ? data.files[fileName].language : '',
      size: data.files[fileName].size,
      content: content ? content : ''
    };
  }
}
