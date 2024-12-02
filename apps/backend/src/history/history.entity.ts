import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lotus } from '@/lotus/lotus.entity';
import { User } from '@/user/user.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid', { name: 'history_id' })
  historyId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'exec_filename' })
  execFilename: string;

  @Column({ type: 'text' })
  input: string;

  @Column({ type: 'text', nullable: true })
  result: string;

  @Column()
  status: string;

  @ManyToOne(() => Lotus, (lotus) => lotus.historys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lotus_id' }) // 외래키 이름 설정
  lotus: Lotus;
}
