import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lotus } from '@/lotus/lotus.entity';
import { Tag } from '@/tag/tag.entity';

@Entity()
export class LotusTag {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'lotus_tag_id' })
  lotusTagId: string;

  @ManyToOne(() => Lotus, (lotus) => lotus.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lotus_id' })
  lotus: Lotus;

  @ManyToOne(() => Tag, (tag) => tag.lotuses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
