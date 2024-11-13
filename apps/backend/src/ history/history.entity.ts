import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lotus } from '@/lotus/lotus.entity';
import { User } from '@/user/user.entity';

@Entity()
export class History {
  //@PrimaryGeneratedColumn('uuid', { type: 'bigint' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  history_id: number;

  @Column({ name: 'commit_id' })
  commitId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  input: string;

  @Column()
  result: string;

  @Column()
  status: string;

  @ManyToOne(() => Lotus, (lotus) => lotus.historys)
  @JoinColumn({ name: 'lotus_id' }) // 외래키 이름 설정
  lotus: Lotus;
}
