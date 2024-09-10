import { Injectable } from '@nestjs/common';
import { MessagePayload } from './observation.entity';
import { ObservationsRepository } from './observation.repository';
import {
  HighwayPayload,
  HighwayPayloadParsed,
} from 'src/highways/highway.entity';

@Injectable()
export class ObservationsService {
  constructor(private observationsRepository: ObservationsRepository) {}

  async insert(
    deviceId: string,
    message: MessagePayload,
  ): Promise<HighwayPayloadParsed> {
    const payloadParsed = await this.payloadParser(message);

    await this.observationsRepository.sendObservationsData(
      deviceId,
      payloadParsed,
    );

    return payloadParsed;
  }

  private async payloadParser(
    payload: HighwayPayload,
  ): Promise<HighwayPayloadParsed> {
    const DEFAULT_TIMESTAMP = new Date().getTime().toString();
    const DEFAULT_INCIDENT = 'Invalid payload format';
    const DEFAULT_DISTANCE = 'Parser Error';
    const DEFAULT_DIRECTION = 'Error';
    const DEFAULT_CITY = 'Unavailable';

    let dataSplit: string[] = [
      DEFAULT_TIMESTAMP,
      DEFAULT_INCIDENT,
      DEFAULT_DISTANCE,
      DEFAULT_DIRECTION,
      DEFAULT_CITY,
    ];

    try {
      dataSplit = payload.payload.split(';');
    } catch (error) {
      console.error(`Invalid payload format! ${JSON.stringify(payload)}`);
    }

    const parsed: HighwayPayloadParsed = {
      hCreatedAt: dataSplit[0]?.toString() || DEFAULT_TIMESTAMP,
      hIncident: dataSplit[1]?.toString() || DEFAULT_INCIDENT,
      hDistance: dataSplit[2]?.toString() || DEFAULT_DISTANCE,
      hDirection: dataSplit[3]?.toString() || DEFAULT_DIRECTION,
      hCity: dataSplit[4]?.toString() || DEFAULT_CITY,
    };

    return parsed;
  }
}
