import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from '@nestjs/microservices/external/kafka.interface';
import { Kafka } from 'kafkajs';
import { fibonacci } from './util';

@Controller()
export class AppController {
  private admin: Admin;
  constructor(@Inject('FIBO_SERVICE') private client: ClientKafka) {}

  @Get('/fibonacci/:number')
  async getFibo(@Param() params: { number: string }) {
    const { number } = params;
    return fibonacci(Number(number));
  }

  private getFiboResult(n: number) {
    return new Promise((resolve) => {
      this.client
        .send('fibo', JSON.stringify({ num: n }))
        .subscribe((result: number) => {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>', result);
          resolve(result);
        });
    });
  }

  @Get('/microservice-fibonacci/:number')
  async getFibonacci(@Param() params: { number: string }) {
    const { number } = params;
    const fibo = await this.getFiboResult(Number(number));
    return fibo;
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
  }
}
