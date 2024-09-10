import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Observations } from './observation.entity';
import { HighwayPayloadParsed } from 'src/highways/highway.entity';

@Injectable()
export class ObservationsRepository extends Repository<Observations> {
  constructor(private dataSource: DataSource) {
    super(Observations, dataSource.createEntityManager());
  }

  async sendObservationsData(
    highwayId: string,
    payloadParsed: HighwayPayloadParsed,
  ): Promise<Observations> {
    const observation = this.create();

    observation.highwayId = highwayId;
    observation.incident = payloadParsed.hIncident;
    observation.distance = payloadParsed.hDistance;
    observation.direction = payloadParsed.hDirection;
    observation.city = payloadParsed.hCity;

    await this.insert(observation);

    console.debug(`Inserted data! | `, observation);

    return observation;
  }

  async listById(highwayId: string): Promise<Observations[]> {
    return await this.find({
      where: {
        highwayId: highwayId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
