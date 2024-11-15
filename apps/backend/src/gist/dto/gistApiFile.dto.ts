export class GistApiFileDto {
  fileName?: string;
  rawUrl?: string;
  type?: string;
  language?: string;
  size?: number;
  content?: string;

  static of(fileName: string, data: any, content: string): GistApiFileDto {
    return {
      fileName: fileName,
      rawUrl: data.files[fileName].raw_url,
      type: data.files[fileName].type,
      language: data.files[fileName].language,
      size: data.files[fileName].size,
      content: content
    };
  }
}
