import { HighwayService } from "../services/highway.service";

export class HighwayController {
  private highwayService: HighwayService;

  constructor() {
    this.highwayService = new HighwayService();
  }

  public async listDevices() {
    return await this.highwayService.listDevices();
  }

  public async getDevice(deviceId: string) {
    return await this.highwayService.getHighway(deviceId);
  }

  public async getDeviceObservations(deviceId: string) {
    const observationsList = await this.highwayService.getHighwayObservations(
      deviceId
    );

    if (observationsList.statusCode === 404) return [];

    return observationsList;
  }
}
