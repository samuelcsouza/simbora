import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { ObservationsModule } from './observations/observation.module';
import { ObservationsService } from './observations/observation.service';
import { ObservationsRepository } from './observations/observation.repository';
import { HighwayModule } from './highways/highway.module';
import { HighwayController } from './highways/highway.controller';
import { HighwayService } from './highways/highway.service';
import { HighwayRepository } from './highways/highway.repository';
import { AppController } from './app.controller';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DEVICE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'app-gateway',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'kafka-microservices',
          },
        },
      },
    ]),
    HighwayModule,
    ObservationsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [HighwayController, AppController],
  providers: [
    HighwayService,
    HighwayRepository,
    ObservationsService,
    ObservationsRepository,
  ],
})
export class AppModule {}
