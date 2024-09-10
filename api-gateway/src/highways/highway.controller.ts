import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { HighwayService } from './highway.service';
import {
  Highways,
  HighwayParams,
  HighwayPayload,
  HighwaySendDataReturnMessage,
} from './highway.entity';
import { ObservationsService } from 'src/observations/observation.service';
import { Observations } from 'src/observations/observation.entity';

@Controller('highways')
export class HighwayController {
  constructor(
    private deviceService: HighwayService,
    private observationService: ObservationsService,
  ) {}

  @Post('/:id')
  async sendHighwayData(
    @Body() payload: HighwayPayload,
    @Param() params: HighwayParams,
  ): Promise<HighwaySendDataReturnMessage> {
    const { id } = params;

    if (!payload.payload) {
      throw new HttpException('Missing Payload!', HttpStatus.BAD_REQUEST);
    }

    const parsedMessage = await this.deviceService.sendData(id, payload);

    const response: HighwaySendDataReturnMessage = {
      timestamp: new Date().getTime(),
      message: parsedMessage,
    };

    return response;
  }

  @Get('/:id')
  async getHighway(@Param() params: HighwayParams): Promise<Highways> {
    const { id } = params;

    return await this.deviceService.getHighway(id);
  }

  @Get('/:id/observations')
  async listObservations(
    @Param() params: HighwayParams,
  ): Promise<Observations[]> {
    const { id } = params;

    return await this.observationService.list(id);
  }

  @Get()
  async listHighways(): Promise<Highways[]> {
    return await this.deviceService.listHighways();
  }
}
