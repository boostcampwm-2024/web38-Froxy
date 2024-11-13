export class GistApiFileDto {
  file_name?: string;
  raw_url?: string;
  type?: string;
  language?: string;
  size?: number;
  content?: string;

  constructor(file_name: string, raw_url: string, type: string, language: string, size: number, content: string) {
    this.file_name = file_name;
    this.raw_url = raw_url;
    this.type = type;
    this.language = language;
    this.size = size;
    this.content = content;
  }
}
