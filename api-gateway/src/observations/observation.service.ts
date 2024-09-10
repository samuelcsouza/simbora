import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ObservationsRepository } from './observation.repository';
import { Observations } from './observation.entity';

@Injectable()
export class ObservationsService {
  constructor(private observationsRepository: ObservationsRepository) {}

  async list(highwayId: string): Promise<Observations[]> {
    let observations: Observations[] = [];

    try {
      observations = await this.observationsRepository.listById(highwayId);
    } catch (error) {
      const e = error as Error;
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    if (observations.length == 0) {
      throw new HttpException(
        `There are no observations for highway ${highwayId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return observations;
  }
}
