import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { STATUSES, USER_ROLES } from '../../config';
import { Base } from './Base.entity';
import { MediaFile } from './MediaFile.entity';
import { Documents } from './Document.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'varchar', nullable: true })
  'first_name': string;

  @Column({ type: 'varchar', nullable: true })
  'last_name': string;

  @Column({ type: 'varchar', nullable: true })
  'phone': string;

  @Column({ type: 'varchar', nullable: true })
  'country_code': string;

  @Column({ type: 'varchar', nullable: true })
  'email': string;

  @Column({ type: 'varchar', nullable: false })
  'password': string;

  @Column({ type: 'varchar', nullable: true })
  'description': string;

  @Column({ type: 'varchar', nullable: false, default: STATUSES.PENDING })
  'status': STATUSES.NOT_VERIFIED | STATUSES.ACTIVE | STATUSES.SUSPENDED;

  @Column({ type: 'varchar', nullable: false, default: USER_ROLES.GUARD })
  'role': USER_ROLES;

  @Column({ name: 'profile_picture_id', type: 'int', nullable: true })
  'profile_picture_id': number;

  @JoinColumn({ name: 'profile_picture_id' })
  @ManyToOne(() => MediaFile, { nullable: true })
  'profile_picture': MediaFile | null;

  @Column(() => Base, { prefix: false })
  'meta': Base;

  @OneToMany(() => Documents, document => document.user)
  'documents': Document[];
}