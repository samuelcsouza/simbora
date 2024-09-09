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
    const DEFAULT_TIMESTAMP = new Date().getTime().toString();
    const DEFAULT_DEVICE_VALUE = 'Invalid payload format';
    const DEFAULT_DEVICE_VARIABLE = 'Parser Error';
    const DEFAULT_DEVICE_UNIT = 'Error';

    let dataSplit: string[] = [
      DEFAULT_TIMESTAMP,
      DEFAULT_DEVICE_VALUE,
      DEFAULT_DEVICE_VARIABLE,
      DEFAULT_DEVICE_UNIT,
    ];

    try {
      dataSplit = payload.payload.split(';');
    } catch (error) {
      console.error(`Invalid payload format! ${JSON.stringify(payload)}`);
    }

    const parsed: DevicePayloadParsed = {
      deviceTimestamp: dataSplit[0]?.toString() || DEFAULT_TIMESTAMP,
      deviceValue: dataSplit[1]?.toString() || DEFAULT_DEVICE_VALUE,
      deviceVariable: dataSplit[2]?.toString() || DEFAULT_DEVICE_VARIABLE,
      deviceUnit: dataSplit[3]?.toString(),
    };

    return parsed;
  }
}
