import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.entity';
import { User } from './User.entity';
import { Job } from './Job.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'int', nullable: true })
  'client_id': number;

  @Column({ type: 'int', nullable: true })
  'guard_id': number;

  @Column({ type: 'int', nullable: true })
  'job_id': number;

  @Column({ type: 'varchar', nullable: false })
  'title': string;

  @Column({ type: 'int', nullable: false,  })
  'rating': number;

  @Column({ type: 'varchar', nullable: false })
  'description': string;

  @Column({ type: 'date', nullable: false })
  'work_completed_at': Date;

  @JoinColumn({ name: 'guard_id' })
  @ManyToOne(() => User, { nullable: true })
  'guard': User | null;

  @JoinColumn({ name: 'client_id' })
  @ManyToOne(() => User, { nullable: true })
  'client': User | null;

  @JoinColumn({ name: 'job_id' })
  @ManyToOne(() => Job, { nullable: true })
  'job': Job | null;

  @Column(() => Base, { prefix: false })
  'meta': Base;
}
