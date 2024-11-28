import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '@/comment/comment.entity';
import { Lotus } from '@/lotus/lotus.entity';

@Entity()
export class User {
  //@PrimaryGeneratedColumn('uuid', { type: 'bigint' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'user_id' })
  userId: string;

  @Column()
  nickname: string;

  @Column({ name: 'profile_path' })
  profilePath: string;

  @Column({ name: 'git_token' })
  gitToken: string;

  @Column({ name: 'gist_url' })
  gistUrl: string;

  @Column({ name: 'git_id', unique: true })
  gitId: number;

  @OneToMany(() => Lotus, (lotus) => lotus.user)
  lotuses: Lotus[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
