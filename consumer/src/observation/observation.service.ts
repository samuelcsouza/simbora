import { Injectable } from '@nestjs/common';
import { ObservationRepository } from './observation.repository';
import { MessagePayload } from './observation.entity';
import { DevicePayload, DevicePayloadParsed } from 'src/device/device.entity';

@Injectable()
export class ObservationService {
  constructor(private observationRepository: ObservationRepository) {}

  async insert(
    deviceId: string,
    message: MessagePayload,
  ): Promise<DevicePayloadParsed> {
    const payloadParsed = await this.payloadParser(message);

    await this.observationRepository.sendObservationData(
      deviceId,
      payloadParsed,
    );

    return payloadParsed;
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
