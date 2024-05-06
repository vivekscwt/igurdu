import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'varchar', nullable: true })
  'address': number;

  @Column({ type: 'float', nullable: true })
  'lat': number;

  @Column({ type: 'float', nullable: true })
  'lng': number;

  @Column({ type: 'float', nullable: true })
  'max_distance': number;

  @Column(() => Base, { prefix: false })
  'meta': Base;
}
