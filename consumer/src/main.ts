import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${uuidv4()}`,
          brokers: [process.env.KAFKA_BROKER],
        },
        consumer: {
          groupId: 'consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
