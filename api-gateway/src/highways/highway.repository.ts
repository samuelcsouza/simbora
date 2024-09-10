import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from '@nestjs/microservices/external/kafka.interface';
import { Kafka } from 'kafkajs';
import { DataSource, Repository } from 'typeorm';
import {
  Highways,
  HighwayPayload,
  HighwayPayloadParsed,
} from './highway.entity';
import { config } from 'dotenv';

config();

@Injectable()
export class HighwayRepository extends Repository<Highways> {
  private admin: Admin;
  constructor(
    @Inject('DEVICE_SERVICE') private client: ClientKafka,
    private dataSource: DataSource,
  ) {
    super(Highways, dataSource.createEntityManager());
  }

  async onModuleInit() {
    try {
      this.client.subscribeToResponseOf('636b4c0f-4490-4213-ba53-db21b44c97b0');
      this.client.subscribeToResponseOf('f65de111-18d2-4cfc-b367-80d208748490');
      this.client.subscribeToResponseOf('e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003');
    } catch (error) {
      console.error(`Error when subscribe into Highways topics!`);
      process.exit(1);
    }

    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: [process.env.KAFKA_BROKER],
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
      try {
        await this.admin.createTopics({
          topics: topicList,
        });
      } catch (error) {
        console.error(`Error while create topics!`, error);
      }
    }
  }

  async sendMessageToTopic(
    topic: string,
    message: HighwayPayload,
  ): Promise<HighwayPayloadParsed> {
    console.debug(
      `Send message to topic ${topic} | message: ${JSON.stringify(message)}`,
    );
    return new Promise((resolve) => {
      this.client
        .send(topic, JSON.stringify(message))
        .subscribe((result: HighwayPayloadParsed) => {
          console.debug(
            `The message was saved. Payload: ${JSON.stringify(result)}`,
          );
          resolve(result);
        });
    });
  }

  async getHighway(highwayId: string): Promise<Highways> {
    const highway = await this.findOne({
      where: { highwayId: highwayId },
    });

    return highway;
  }

  async listHighways(): Promise<Highways[]> {
    const highwayList = await this.find({});

    return highwayList;
  }
}
