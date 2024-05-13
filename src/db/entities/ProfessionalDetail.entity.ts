import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './Base.entity';

@Entity('professional_details')
export class ProfessionDetail {
  @PrimaryGeneratedColumn()
  'id': number;

  @Column({ type: 'varchar', nullable: true })
  'operation_type': string;

  @Column({ type: 'varchar', nullable: true })
  'trading_name': string;

  @Column({ type: 'varchar', nullable: true })
  'registered_company_name': number;

  @Column({ type: 'varchar', nullable: true })
  'company_reg_no': string;

  @Column({ type: 'varchar', nullable: true })
  'fullNames_of_partners': string;

  @Column(() => Base, { prefix: false })
  'meta': Base;
}
