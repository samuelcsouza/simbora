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

export interface DeviceSendDataParams {
  id: string;
}

export interface DeviceSendDataReturnMessage {
  status: string;
  timestamp: number;
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
