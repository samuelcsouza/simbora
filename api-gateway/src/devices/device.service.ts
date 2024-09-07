import { Injectable } from '@nestjs/common';
import { DeviceRepository } from './device.repository';
import { DevicePayload, DevicePayloadParsed } from './device.entity';

@Injectable()
export class DeviceService {
  constructor(private deviceRepository: DeviceRepository) {}

  async sendData(payload: DevicePayload): Promise<DevicePayload> {
    console.debug(`> Passing into device service! Payload: ${payload.payload}`);

    const parsedData = await this.payloadParser(payload);

    console.debug('Parsed data!', parsedData);

    // Apply rules!
    return await this.deviceRepository.sendMessageToTopic('fibo', parsedData);
  }

  private async payloadParser(
    payload: DevicePayload,
  ): Promise<DevicePayloadParsed> {
    const dataSplit = payload.payload.split(';');

    const parsed: DevicePayloadParsed = {
      deviceTimestamp: dataSplit[0].toString(),
      deviceValue: dataSplit[1].toString(),
      deviceVariable: dataSplit[2].toString(),
      deviceUnit: dataSplit[3].toString(),
    };

    return parsed;
  }
}
