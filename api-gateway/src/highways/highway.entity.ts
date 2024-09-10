import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface HighwayPayload {
  payload: string;
}

export interface HighwayPayloadParsed {
  hCreatedAt: string;
  hIncident: string;
  hDistance: string;
  hDirection: string;
  hCity: string;
}

export interface HighwayParams {
  id: string;
}

export interface HighwaySendDataReturnMessage {
  timestamp: number;
  message: HighwayPayloadParsed | string;
}

export interface HighwaySendDataResponse {
  message: HighwayPayloadParsed;
}

@Entity()
export class Highways extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  highwayId: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  highwayName: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
