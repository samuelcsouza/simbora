import { Injectable } from '@nestjs/common';
import { DeviceRepository } from './device.repository';

@Injectable()
export class DeviceService {
  constructor(private deviceRepository: DeviceRepository) {}

  async sendData(payload: any): Promise<any> {
    console.debug(`> Passing into device service! Payload: ${payload.payload}`);

    // Apply rules!
    return await this.deviceRepository.sendMessageToTopic('fibo', payload);
  }
}
