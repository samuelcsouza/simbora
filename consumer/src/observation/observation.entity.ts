import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface MessagePayload {
  payload: string;
}

@Entity()
export class Observation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  observationId: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  value: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  variable: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  unit: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  deviceId: string;

  @CreateDateColumn()
  createdAt: Date;
}
