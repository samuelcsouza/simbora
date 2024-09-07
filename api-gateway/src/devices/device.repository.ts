import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from '@nestjs/microservices/external/kafka.interface';
import { Kafka } from 'kafkajs';

@Injectable()
export class DeviceRepository {
  private admin: Admin;
  constructor(@Inject('FIBO_SERVICE') private client: ClientKafka) {}

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
  }

  async sendMessageToTopic(topic: string, message: any): Promise<any> {
    console.debug(
      `> Passing into Device Repository! Message: ${JSON.stringify(message)}`,
    );

    return new Promise((resolve) => {
      this.client
        // .send('fibo', JSON.stringify({ num: n }))
        .send(topic, JSON.stringify(message))
        .subscribe((result: number) => {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>', result);
          resolve(result);
        });
    });
  }
}
