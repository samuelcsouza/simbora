import { Injectable } from '@nestjs/common';
import { ObservationRepository } from './observation.repository';
import { Observation } from './observation.entity';
import { DevicePayloadParsed } from 'src/device/device.entity';

@Injectable()
export class ObservationService {
  constructor(private observationRepository: ObservationRepository) {}

  async insert(
    deviceId: string,
    payloadParsed: DevicePayloadParsed,
  ): Promise<Observation> {
    return await this.observationRepository.sendObservationData(
      deviceId,
      payloadParsed,
    );
  }
}
