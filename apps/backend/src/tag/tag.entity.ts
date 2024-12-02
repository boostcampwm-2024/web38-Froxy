import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Lotus } from '@/lotus/lotus.entity';
import { LotusTag } from '@/relation/lotus.tag.entity';

@Entity()
export class Tag {
  //@PrimaryGeneratedColumn('uuid', { type: 'bigint' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'tag_id' })
  tagId: string;

  @Column({ name: 'tag_name' })
  tagName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => LotusTag, (lotusTag) => lotusTag.tag, { cascade: ['remove'] })
  lotuses: LotusTag[];
}
