import { Injectable } from '@nestjs/common';
import { DeviceRepository } from './device.repository';
import { DevicePayload } from './device.entity';

@Injectable()
export class DeviceService {
  constructor(private deviceRepository: DeviceRepository) {}

  async sendData(payload: DevicePayload): Promise<DevicePayload> {
    return await this.deviceRepository.sendMessageToTopic('fibo', payload);
  }
}
