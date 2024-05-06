import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.entity';
import { User } from './User.entity';
import { Job } from './Job.entity';
import { APPLICATION_STATUS } from '../../config';

@Entity('applications')
export class Applications {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'int', nullable: true })
  'guard_id': number;

  @Column({ type: 'int', nullable: true })
  'job_id': number;

  @Column({ type: 'varchar', nullable: true })
  'previous_status': APPLICATION_STATUS;

  @Column({ type: 'varchar', nullable: false, default: APPLICATION_STATUS.APPLIED })
  'status': APPLICATION_STATUS;

  @JoinColumn({ name: 'guard_id' })
  @ManyToOne(() => User, { nullable: true })
  'guard': User | null;

  @JoinColumn({ name: 'job_id' })
  @ManyToOne(() => Job, { nullable: true })
  'job': Job | null;

  @Column(() => Base, { prefix: false })
  'meta': Base;
}
