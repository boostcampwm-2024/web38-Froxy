import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Comment } from '@/comment/comment.entity';
import { History } from '@/history/history.entity';
import { LotusTag } from '@/relation/lotus.tag.entity';
import { User } from '@/user/user.entity';

@Entity()
export class Lotus {
  @PrimaryGeneratedColumn('uuid', { name: 'lotus_id' })
  lotusId: string;

  @Column()
  title: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ name: 'gist_repository_id', nullable: false })
  gistRepositoryId: string;

  @Column({ name: 'commit_id', nullable: false })
  commitId: string;

  @Column()
  language: string;

  @Column({ name: 'version' })
  version: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.lotuses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // 외래키 이름 설정
  user: User;

  @OneToMany(() => Comment, (comment) => comment.lotus, { cascade: ['remove'] })
  comments: Comment[];

  @OneToMany(() => History, (history) => history.lotus, { cascade: ['remove'] })
  historys: History[];

  @OneToMany(() => LotusTag, (lotusTag) => lotusTag.lotus, { cascade: ['remove'] })
  tags: LotusTag[];
}
