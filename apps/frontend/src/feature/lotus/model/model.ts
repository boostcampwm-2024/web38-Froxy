export interface LotusDto {
  id: string;
  link: string;
  title: string;
  logo: string;
  date: string;
  tags: string[];
  isPublic?: boolean;
  gistUrl: string;
}

export class LotusModel {
  public id: string;
  public link: string;
  public title: string;
  public logo: string;
  public date: Date;
  public tags: string[];
  public isPublic?: boolean;
  public gistUrl: string;

  constructor(dto: LotusDto) {
    this.id = dto.id;
    this.link = dto.link;
    this.title = dto.title;
    this.logo = dto.logo;
    this.date = new Date(dto.date);
    this.tags = dto.tags;
    this.isPublic = dto.isPublic;
    this.gistUrl = dto.gistUrl;
  }

  clone(data: Partial<LotusModel>) {
    const { date, ...modelData } = this;
    const { date: updateDate, ...update } = data;

    return new LotusModel({
      ...modelData,
      date: updateDate?.toISOString() || date.toISOString(),
      ...update
    });
  }

  get isTagsEmpty() {
    return this.tags.length < 1;
  }
}
