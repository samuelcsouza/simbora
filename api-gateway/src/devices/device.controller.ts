import { Body, Controller, Param, Post } from '@nestjs/common';
import { DeviceService } from './device.service';

@Controller('devices')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Post('/:id')
  async sendDeviceData(
    @Body() payload: any,
    @Param() params: { id: string },
  ): Promise<any> {
    await this.deviceService.sendData(payload);

    return {
      id: params.id,
      payload: payload.payload,
    };
  }
}
