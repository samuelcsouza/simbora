import { Injectable } from '@nestjs/common';
import { DeviceRepository } from './device.repository';
import { Device, DevicePayload, DeviceSendDataResponse } from './device.entity';

@Injectable()
export class DeviceService {
  constructor(private deviceRepository: DeviceRepository) {}

  async sendData(
    topic: string,
    payload: DevicePayload,
  ): Promise<DeviceSendDataResponse> {
    try {
      await this.deviceRepository.sendMessageToTopic(topic, payload);
      return {
        success: true,
        message: 'Data was sent',
      };
    } catch (error) {
      console.error(`Error when send message: `, error);
      const e: Error = error;
      return {
        success: false,
        message: e.message,
      };
    }
  }

  async getDevice(deviceId: string): Promise<Device> {
    return await this.deviceRepository.getDevice(deviceId);
  }

  async listDevices(): Promise<Device[]> {
    return await this.deviceRepository.listDevices();
  }
}
