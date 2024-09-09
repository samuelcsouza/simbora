import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ObservationRepository } from './observation.repository';
import { Observation } from './observation.entity';

@Injectable()
export class ObservationService {
  constructor(private observationRepository: ObservationRepository) {}

  async list(deviceId: string): Promise<Observation[]> {
    let observations: Observation[] = [];

    try {
      observations = await this.observationRepository.listById(deviceId);
    } catch (error) {
      console.log(error);
    }

    if (observations.length == 0) {
      throw new HttpException(
        `There are no observations for device ${deviceId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return observations;
  }
}
