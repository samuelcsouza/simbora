import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeviceService } from './device.service';
import {
  Device,
  DevicePayload,
  DeviceParams,
  DeviceSendDataReturnMessage,
} from './device.entity';
import { ObservationService } from 'src/observation/observation.service';
import { Observation } from 'src/observation/observation.entity';

@Controller('devices')
export class DeviceController {
  constructor(
    private deviceService: DeviceService,
    private observationService: ObservationService,
  ) {}

  @Post('/:id')
  async sendDeviceData(
    @Body() payload: DevicePayload,
    @Param() params: DeviceParams,
  ): Promise<DeviceSendDataReturnMessage> {
    const { id } = params;

    if (!payload.payload) {
      return {
        status: false,
        message: 'Missing payload!',
        timestamp: new Date().getTime(),
      };
    }

    const { success, message } = await this.deviceService.sendData(id, payload);

    const response: DeviceSendDataReturnMessage = {
      status: success,
      message: message,
      timestamp: new Date().getTime(),
    };

    return response;
  }

  @Get('/:id')
  async getDevice(@Param() params: DeviceParams): Promise<Device> {
    const { id } = params;

    return await this.deviceService.getDevice(id);
  }

  @Get('/:id/observations')
  async listObservations(
    @Param() params: DeviceParams,
  ): Promise<Observation[]> {
    const { id } = params;

    return await this.observationService.list(id);
  }

  @Get()
  async listDevices(): Promise<Device[]> {
    return await this.deviceService.listDevices();
  }
}
