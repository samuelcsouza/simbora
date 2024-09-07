import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from '@nestjs/microservices/external/kafka.interface';
import { Kafka } from 'kafkajs';
import { Device, DevicePayload } from './device.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DeviceRepository extends Repository<Device> {
  private admin: Admin;
  constructor(
    @Inject('FIBO_SERVICE') private client: ClientKafka,
    private dataSource: DataSource,
  ) {
    super(Device, dataSource.createEntityManager());
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf('fibo');
    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:29092'],
    });
    this.admin = kafka.admin();
    const topics = await this.admin.listTopics();

    const topicList = [];
    if (!topics.includes('fibo')) {
      topicList.push({
        topic: 'fibo',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (!topics.includes('fibo.reply')) {
      topicList.push({
        topic: 'fibo.reply',
        numPartitions: 10,
        replicationFactor: 1,
      });
    }

    if (topicList.length) {
      await this.admin.createTopics({
        topics: topicList,
      });
    }

    await this.createDevice('device 1', 'device 1 description kkkk');
    await this.createDevice('device 2', 'device 2 description kkkk');
    await this.createDevice('device 3', 'device 3 description kkkk');
  }

  async sendMessageToTopic(
    topic: string,
    message: DevicePayload,
  ): Promise<any> {
    return new Promise((resolve) => {
      this.client
        .send(topic, JSON.stringify(message))
        .subscribe((result: any) => {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>', result);
          resolve(result);
        });
    });
  }

  async createDevice(name: string, description: string): Promise<Device> {
    const device = this.create();

    device.deviceName = name;
    device.description = description;

    try {
      await device.save();

      console.debug(`Created a new device! ${device.deviceId}`);
      return device;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error when create a new Device! ${String(error)}`,
      );
    }
  }
}
