import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lotus } from '@/lotus/lotus.entity';
import { User } from '@/user/user.entity';

@Entity()
export class Comment {
  //@PrimaryGeneratedColumn('uuid', { type: 'bigint' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'comment_id' })
  commentId: string;

  @Column({ name: 'comment_content' })
  commentContent: string;

  @Column({ name: 'is_public' })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // 외래키 이름 설정
  user: User;

  @ManyToOne(() => Lotus, (lotus) => lotus.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lotus_id' }) // 외래키 이름 설정
  lotus: Lotus;
}
