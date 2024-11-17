import { UserType } from '@/feature/User/type';

export interface LotusType {
  id: string;
  link: string;
  title: string;
  logo: string;
  date: Date;
  tags: string[];
  author: UserType;
  isPublic?: boolean;
}

export type BadgeVariantType = 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined;
