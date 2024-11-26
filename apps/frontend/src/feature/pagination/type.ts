export interface PageDto {
  current: number;
  max: number;
}

export class PageModel {
  public current: number;
  public max: number;

  constructor(dto: PageDto) {
    this.current = dto.current;
    this.max = dto.max;
  }
}
