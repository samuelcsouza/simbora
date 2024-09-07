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

  @MessagePattern('fibo')
  async getFibonacci(@Payload() message: { payload: string }) {
    console.log(`new message!`, message);
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
