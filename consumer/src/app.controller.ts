import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ObservationService } from './observation/observation.service';
import { MessagePayload } from './observation/observation.entity';

@Controller()
export class AppController {
  constructor(private observationService: ObservationService) {}

  @MessagePattern('636b4c0f-4490-4213-ba53-db21b44c97b0')
  async getDevice1Message(@Payload() message: MessagePayload) {
    console.log(
      `new message from topic 636b4c0f-4490-4213-ba53-db21b44c97b0 | `,
      message,
    );

    return await this.observationService.insert(
      '636b4c0f-4490-4213-ba53-db21b44c97b0',
      message,
    );
  }

  @MessagePattern('f65de111-18d2-4cfc-b367-80d208748490')
  async getDevice2Message(@Payload() message: MessagePayload) {
    console.log(
      `new message from topic f65de111-18d2-4cfc-b367-80d208748490 | `,
      message,
    );

    return await this.observationService.insert(
      'f65de111-18d2-4cfc-b367-80d208748490',
      message,
    );
  }

  @MessagePattern('e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003')
  async getDevice3Message(@Payload() message: MessagePayload) {
    console.log(
      `new message from topic e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003 | `,
      message,
    );

    return await this.observationService.insert(
      'e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003',
      message,
    );
  }
}
