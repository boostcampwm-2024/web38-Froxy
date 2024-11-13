import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lotus } from '@/lotus/lotus.entity';
import { User } from '@/user/user.entity';

@Entity()
export class Tag {
  //@PrimaryGeneratedColumn('uuid', { type: 'bigint' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'tag_id' })
  tagId: number;

  @Column({ name: 'tag_name' })
  tagName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
