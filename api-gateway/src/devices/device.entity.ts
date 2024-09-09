import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface DevicePayload {
  payload: string;
}

export interface DevicePayloadParsed {
  deviceTimestamp: string;
  deviceValue: string;
  deviceVariable: string;
  deviceUnit: string;
}

export interface DeviceParams {
  id: string;
}

export interface DeviceSendDataReturnMessage {
  timestamp: number;
  message: DevicePayloadParsed | string;
}

export interface DeviceSendDataResponse {
  message: DevicePayloadParsed;
}

@Entity()
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  deviceId: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  deviceName: string;

  @Column({ nullable: false, type: 'varchar', length: 500 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
