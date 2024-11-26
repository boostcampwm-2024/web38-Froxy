import { CANT_VIEW_EXT, LANGUAGES_EXT } from './constant';

export interface CodeFileDto {
  filename: string;
  language: string;
  content: string;
}

export class CodeFileModel {
  public filename: string;
  public language: string;
  public content: string;
  public ext: string;

  constructor(dto: CodeFileDto) {
    this.filename = dto?.filename || '';
    this.language = dto?.language || '';
    this.content = dto?.content || '';
    this.ext = dto.filename.split('.').pop() || '';
  }

  static getDefaultFile(list: CodeFileModel[]) {
    const readme = CodeFileModel.getREADME(list);
    const md = list.find((file) => file.isMarkdown);

    return readme || md;
  }

  static getREADME(list: CodeFileModel[]) {
    return list.find((file) => file.isREADME);
  }

  get isREADME() {
    return this.filename === 'README.md';
  }

  get isMarkdown() {
    return this.ext === 'md';
  }

  get isCode() {
    return this.ext in LANGUAGES_EXT;
  }

  get canView() {
    return !CANT_VIEW_EXT.includes(this.ext);
  }

  toMarkdown() {
    return this.isCode ? `\`\`\`${this.ext}\n${this.content}\n \`\`\`` : this.content;
  }
}
