import { Column, CreateDateColumn } from 'typeorm';

export abstract class Base {
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  'created_on': Date;

  @Column({ type: 'varchar', nullable: true })
  'created_by': string;

  @Column({ type: 'timestamp', nullable: true })
  'modified_on': Date;

  @Column({ type: 'varchar', nullable: true })
  'modified_by': string;

  @Column({ type: 'boolean', nullable: true, default: false })
  'deleted_flag': boolean;

  @Column({ type: 'timestamp', nullable: true })
  'deleted_on': Date;

  @Column({ type: 'varchar', nullable: true })
  'deleted_by': string;
}
