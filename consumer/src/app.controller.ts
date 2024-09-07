import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DevicePayload, DevicePayloadParsed } from './device/device.entity';
import { ObservationService } from './observation/observation.service';

@Controller()
export class AppController {
  constructor(private observationService: ObservationService) {}

  @MessagePattern('636b4c0f-4490-4213-ba53-db21b44c97b0')
  async getFibonacci(@Payload() message: { payload: string }) {
    console.log(
      `new message from topic 636b4c0f-4490-4213-ba53-db21b44c97b0 | `,
      message,
    );

    const payloadParsed = await this.payloadParser(message);

    await this.observationService.insert(
      '636b4c0f-4490-4213-ba53-db21b44c97b0',
      payloadParsed,
    );

    return payloadParsed;
  }

  @MessagePattern('f65de111-18d2-4cfc-b367-80d208748490')
  async getDevicePayload(@Payload() message: { payload: string }) {
    console.log(
      `new message from topic f65de111-18d2-4cfc-b367-80d208748490 | `,
      message,
    );

    const payloadParsed = await this.payloadParser(message);

    await this.observationService.insert(
      'f65de111-18d2-4cfc-b367-80d208748490',
      payloadParsed,
    );

    return payloadParsed;
  }

  @MessagePattern('e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003')
  async getDevicePayload2(@Payload() message: { payload: string }) {
    console.log(
      `new message from topic e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003 | `,
      message,
    );

    const payloadParsed = await this.payloadParser(message);

    await this.observationService.insert(
      'e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003',
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
