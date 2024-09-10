import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Highways,
  HighwayPayload,
  HighwayPayloadParsed,
} from './highway.entity';
import { HighwayRepository } from './highway.repository';

@Injectable()
export class HighwayService {
  constructor(private highwayRepository: HighwayRepository) {}

  async sendData(
    topic: string,
    payload: HighwayPayload,
  ): Promise<HighwayPayloadParsed> {
    try {
      return await this.highwayRepository.sendMessageToTopic(topic, payload);
    } catch (error) {
      console.error(`Error when send message: `, error);
      const e: Error = error;
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getHighway(highwayId: string): Promise<Highways> {
    let highway: Highways;
    try {
      highway = await this.highwayRepository.getHighway(highwayId);
    } catch (error) {
      const e = error as Error;
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    if (!highway) {
      throw new HttpException(
        `The highway with id ${highwayId} was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return highway;
  }

  async listHighways(): Promise<Highways[]> {
    let highwayList: Highways[] = [];

    try {
      highwayList = await this.highwayRepository.listHighways();
    } catch (error) {
      const e = error as Error;
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

    if (highwayList.length == 0) {
      throw new HttpException(
        `There are no highways in the Database`,
        HttpStatus.NOT_FOUND,
      );
    }

    return highwayList;
  }
}
