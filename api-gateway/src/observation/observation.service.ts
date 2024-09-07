import { Injectable } from '@nestjs/common';
import { ObservationRepository } from './observation.repository';
import { Observation } from './observation.entity';

@Injectable()
export class ObservationService {
  constructor(private observationRepository: ObservationRepository) {}

  async list(deviceId: string): Promise<Observation[]> {
    return await this.observationRepository.listById(deviceId);
  }
}
