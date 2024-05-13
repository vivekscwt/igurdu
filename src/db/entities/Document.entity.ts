import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.entity';
import { User } from './User.entity';

@Entity('documents')
export class Documents {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'int', nullable: true })
  'user_id': number;

  @Column({ type: 'varchar', nullable: true })
  'doc_type': string;

  @Column({ type: 'varchar', nullable: true, default: 'front' })
  'direction': 'front' | 'back';

  @Column({ type: 'varchar', nullable: true })
  'url': string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { nullable: true })
  'user': User | null;

  @Column(() => Base, { prefix: false })
  'meta': Base;
}
