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
import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

@Entity()
export class Lotus {
  //@PrimaryGeneratedColumn('uuid', { type: 'bigint' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'lotus_id' })
  lotusId: string;

  @Column()
  title: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ name: 'gist_repository_id' })
  gistRepositoryId: string;

  @Column({ name: 'commit_id', nullable: true })
  commitId: string;

  @Column()
  language: string;

  @Column({ name: 'version' })
  version: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.lotuses)
  @JoinColumn({ name: 'user_id' }) // 외래키 이름 설정
  user: User;

  @OneToMany(() => Comment, (comment) => comment.lotus, { cascade: ['remove'] })
  comments: Comment[];

  @OneToMany(() => History, (history) => history.lotus, { cascade: ['remove'] })
  historys: History[];

  @ManyToMany(() => Tag, { cascade: ['remove'] })
  @JoinTable({
    name: 'lotus_tags', // 교차 테이블 이름 지정
    joinColumn: {
      name: 'lotus_id', // 이 컬럼은 Lotus 엔티티를 참조
      referencedColumnName: 'lotusId'
    },
    inverseJoinColumn: {
      name: 'tag_id', // 이 컬럼은 Tag 엔티티를 참조
      referencedColumnName: 'tagId'
    }
  })
  category: Tag[];
}
