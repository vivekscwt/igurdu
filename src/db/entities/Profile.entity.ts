import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.entity';
import { User } from './User.entity';
import { Location } from './Location.entity';
import { ProfessionDetail } from './ProfessionalDetail.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'int', nullable: true })
  'user_id': number;

  @Column({ type: 'int', nullable: true })
  'location_id': number;

  @Column({ type: 'int', nullable: true })
  'profession_details_id': number;

  @Column({ type: 'boolean', default: false })
  'document_uploaded': boolean;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { nullable: true })
  'user': User | null;

  @JoinColumn({ name: 'location_id' })
  @ManyToOne(() => Location, { nullable: true })
  'location': Location | null;

  @JoinColumn({ name: 'profession_details_id' })
  @ManyToOne(() => ProfessionDetail, { nullable: true })
  'profession_details': ProfessionDetail | null;

  @Column(() => Base, { prefix: false })
  'meta': Base;
}
