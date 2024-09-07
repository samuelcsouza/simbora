import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeviceService } from './device.service';
import {
  Device,
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
    const { id } = params;

    await this.deviceService.sendData(id, payload);

    const response: DeviceSendDataReturnMessage = {
      status: 'success',
      timestamp: new Date().getTime(),
    };

    return response;
  }

  @Get('/:id')
  async getDevice(@Param() params: { id: string }): Promise<Device> {
    return await this.deviceService.getDevice(params.id);
  }
}
