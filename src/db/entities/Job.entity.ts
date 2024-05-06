import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.entity';
import { User } from './User.entity';
import { STATUSES } from '../../config';
import { IStartDateTime } from '../../interfaces/requests/job.entity.interface';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'int', nullable: true })
  'client_id': number;

  @Column({ type: 'varchar', nullable: false })
  'title': string;

  @Column({ type: 'varchar', nullable: false })
  'description': string;

  @Column({ type: 'varchar', nullable: false })
  'address': string;

  @Column({ type: 'varchar', nullable: false })
  'lat': string;

  @Column({ type: 'varchar', nullable: false })
  'lng': string;

  @Column({ type: 'varchar', nullable: false })
  'postcode': string;

  @Column({ type: 'varchar', nullable: false, default: STATUSES.OPEN })
  'status': STATUSES.OPEN | STATUSES.FILLED | STATUSES.SUSPENDED;

  @Column({ type: 'json', nullable: false })
  'lookingFor': string[];

  @Column({ type: 'varchar', nullable: false })
  'quantity': string;

  @Column({ type: 'json', nullable: false })
  'startDateTime': IStartDateTime [];

  @Column({ type: 'varchar', nullable: false })
  'budget': string;

  @JoinColumn({ name: 'client_id' })
  @ManyToOne(() => User, { nullable: true })
  'user': User | null;

  @Column(() => Base, { prefix: false })
  'meta': Base;
}
