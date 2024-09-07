import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeviceModule } from './devices/device.module';
import { DeviceController } from './devices/device.controller';
import { DeviceService } from './devices/device.service';
import { DeviceRepository } from './devices/device.repository';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FIBO_SERVICE',
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
  ],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceRepository],
})
export class AppModule {}
