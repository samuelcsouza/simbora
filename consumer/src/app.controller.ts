import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DevicePayload, DevicePayloadParsed } from './device.entity';

@Controller()
export class AppController {
  private fibonacci(n: number) {
    return n < 1
      ? 0
      : n <= 2
      ? 1
      : this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  @MessagePattern('636b4c0f-4490-4213-ba53-db21b44c97b0')
  async getFibonacci(@Payload() message: { payload: string }) {
    console.log(
      `new message from topic 636b4c0f-4490-4213-ba53-db21b44c97b0 | `,
      message,
    );
    return await this.payloadParser(message);
  }

  @MessagePattern('f65de111-18d2-4cfc-b367-80d208748490')
  async getDevicePayload(@Payload() message: { payload: string }) {
    console.log(
      `new message from topic f65de111-18d2-4cfc-b367-80d208748490 | `,
      message,
    );
    return await this.payloadParser(message);
  }

  @MessagePattern('e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003')
  async getDevicePayload2(@Payload() message: { payload: string }) {
    console.log(
      `new message from topic e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003 | `,
      message,
    );
    return await this.payloadParser(message);
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
