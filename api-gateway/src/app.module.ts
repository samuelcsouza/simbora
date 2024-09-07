import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeviceModule } from './devices/device.module';
import { DeviceController } from './devices/device.controller';
import { DeviceService } from './devices/device.service';
import { DeviceRepository } from './devices/device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DEVICE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'app-gateway',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'kafka-microservices',
          },
        },
      },
    ]),
    DeviceModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceRepository],
})
export class AppModule {}
