import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceRepository } from './device.repository';
import { Device, DevicePayload, DevicePayloadParsed } from './device.entity';

@Injectable()
export class DeviceService {
  constructor(private deviceRepository: DeviceRepository) {}

  async sendData(
    topic: string,
    payload: DevicePayload,
  ): Promise<DevicePayloadParsed> {
    try {
      const msg = await this.deviceRepository.sendMessageToTopic(
        topic,
        payload,
      );

      return msg;
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
    let deviceList: Device[] = [];

    try {
      deviceList = await this.deviceRepository.listDevices();
    } catch (error) {
      const e = error as Error;
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    if (deviceList.length == 0) {
      throw new HttpException(
        `There are no devices in the Database`,
        HttpStatus.NOT_FOUND,
      );
    }

    return deviceList;
  }
}
