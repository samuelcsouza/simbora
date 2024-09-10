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
export class Observations extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  observationId: string;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  incident: string;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  distance: string;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  direction: string;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  city: string;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  highwayId: string;

  @CreateDateColumn()
  createdAt: Date;
}
