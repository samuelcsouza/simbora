import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from '@nestjs/microservices/external/kafka.interface';
import { Kafka } from 'kafkajs';
import { Device, DevicePayload } from './device.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DeviceRepository extends Repository<Device> {
  private admin: Admin;
  constructor(
    @Inject('DEVICE_SERVICE') private client: ClientKafka,
    private dataSource: DataSource,
  ) {
    super(Device, dataSource.createEntityManager());
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf('636b4c0f-4490-4213-ba53-db21b44c97b0');
    this.client.subscribeToResponseOf('f65de111-18d2-4cfc-b367-80d208748490');
    this.client.subscribeToResponseOf('e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003');

    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:29092'],
    });
    this.admin = kafka.admin();
    const topics = await this.admin.listTopics();

    const topicList = [];
    if (!topics.includes('636b4c0f-4490-4213-ba53-db21b44c97b0')) {
      topicList.push({
        topic: '636b4c0f-4490-4213-ba53-db21b44c97b0',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (!topics.includes('f65de111-18d2-4cfc-b367-80d208748490')) {
      topicList.push({
        topic: 'f65de111-18d2-4cfc-b367-80d208748490',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (!topics.includes('e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003')) {
      topicList.push({
        topic: 'e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (topicList.length) {
      await this.admin.createTopics({
        topics: topicList,
      });
    }
  }

  async sendMessageToTopic(
    topic: string,
    message: DevicePayload,
  ): Promise<any> {
    console.debug(
      `Send message to topic ${topic} | message: ${JSON.stringify(message)}`,
    );
    return new Promise((resolve) => {
      this.client
        .send(topic, JSON.stringify(message))
        .subscribe((result: any) => {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>', result);
          resolve(result);
        });
    });
  }

  async getDevice(deviceId: string): Promise<Device> {
    const device = this.findOne({
      where: { deviceId: deviceId },
    });

    return device;
  }

  async listDevices(): Promise<Device[]> {
    const deviceList = this.find({});

    return deviceList;
  }
}
