import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GistApiFileDto } from '@/gist/dto/gistApiFile.dto';

export class FileDto {
  @IsString()
  @ApiProperty({
    example: 'gist 내부 파일1.js'
  })
  filename: string;

  @IsString()
  @ApiProperty({
    example: 'javascript'
  })
  language: string;

  @IsString()
  @ApiProperty({
    example: 'console.log("hi");'
  })
  content: string;
  static ofGistApiFile(file: GistApiFileDto): FileDto {
    return { filename: file.fileName, language: file.language, content: file.content };
  }
}
