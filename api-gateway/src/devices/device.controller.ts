import { Body, Controller, Param, Post } from '@nestjs/common';
import { DeviceService } from './device.service';
import {
  DevicePayload,
  DeviceSendDataParams,
  DeviceSendDataReturnMessage,
} from './device.entity';

@Controller('devices')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Post('/:id')
  async sendDeviceData(
    @Body() payload: DevicePayload,
    @Param() params: DeviceSendDataParams,
  ): Promise<DeviceSendDataReturnMessage> {
    await this.deviceService.sendData(payload);

    const response: DeviceSendDataReturnMessage = {
      status: 'ok',
      timestamp: new Date().getTime(),
    };

    return response;
  }
}
