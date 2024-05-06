import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.entity';
import { User } from './User.entity';
import { Job } from './Job.entity';
import { APPLICATION_STATUS, STATUSES } from '../../config';

@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'int', nullable: true })
  'guard_id': number;

  @Column({ type: 'varchar', nullable: false })
  'sia_number': string;

  @Column({ type: 'varchar', nullable: false })
  'expiry_date_from': string;

  @Column({ type: 'varchar', nullable: false })
  'expiry_date_to': string;

  @Column({ type: 'varchar', nullable: false })
  'role': string;

  @Column({ type: 'varchar', nullable: false })
  'sector': string;

  @Column({ type: 'json', nullable: false })
  'trades': string[];

  @Column({ type: 'varchar', nullable: false, default: STATUSES.UNVERIFIED })
  'status': STATUSES.UNVERIFIED | STATUSES.VERIFIED | STATUSES.SUSPENDED | STATUSES.RECOMMENDED;

  @JoinColumn({ name: 'guard_id' })
  @ManyToOne(() => User, { nullable: true })
  'guard': User | null;

  @Column(() => Base, { prefix: false })
  'meta': Base;
}
