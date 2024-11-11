interface AuthorType {
  id: number;
  nickname: string;
  profile: string;
}

export interface LotusType {
  link: string;
  title: string;
  logo: string;
  date: Date;
  tags: string[];
  author: AuthorType;
  isPublic?: boolean;
}
