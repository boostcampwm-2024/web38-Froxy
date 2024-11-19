import { IsString } from 'class-validator';
import { Tag } from '@/tag/tag.entity';
export class TagSearchResponseDTO {
  @IsString()
  tagName: string;

  static of(tag: Tag): TagSearchResponseDTO {
    return {
      tagName: tag.tagName
    };
  }
}
