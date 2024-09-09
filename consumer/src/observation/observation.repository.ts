import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Observation } from './observation.entity';
import { DevicePayloadParsed } from 'src/device/device.entity';

@Injectable()
export class ObservationRepository extends Repository<Observation> {
  constructor(private dataSource: DataSource) {
    super(Observation, dataSource.createEntityManager());
  }

  async sendObservationData(
    deviceId: string,
    payloadParsed: DevicePayloadParsed,
  ): Promise<Observation> {
    const observation = this.create();

    observation.deviceId = deviceId;
    observation.unit = payloadParsed.deviceUnit;
    observation.value = payloadParsed.deviceValue;
    observation.variable = payloadParsed.deviceVariable;

    await this.insert(observation);

    console.debug(`Inserted data! ${JSON.stringify(observation)}\n`);

    return observation;
  }
}
