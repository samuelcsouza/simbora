import { Injectable } from '@nestjs/common';
import { DeviceRepository } from './device.repository';
import { Device, DevicePayload } from './device.entity';

@Injectable()
export class DeviceService {
  constructor(private deviceRepository: DeviceRepository) {}

  async sendData(
    topic: string,
    payload: DevicePayload,
  ): Promise<DevicePayload> {
    return await this.deviceRepository.sendMessageToTopic(topic, payload);
  }

  async getDevice(deviceId: string): Promise<Device> {
    return await this.deviceRepository.getDevice(deviceId);
  }
}
