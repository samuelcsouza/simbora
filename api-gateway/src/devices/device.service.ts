import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDevice(deviceId: string): Promise<Device> {
    let device: Device;
    try {
      device = await this.deviceRepository.getDevice(deviceId);
    } catch (error) {
      const e = error as Error;
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    if (!device) {
      throw new HttpException(
        `The device with id ${deviceId} was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return device;
  }

  async listDevices(): Promise<Device[]> {
    return await this.deviceRepository.listDevices();
  }
}
