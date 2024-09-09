import { DeviceService } from "../services/device.service";

export class DeviceController {
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  public async listDevices() {
    return await this.deviceService.listDevices();
  }

  public async getDevice(deviceId: string) {
    return await this.deviceService.getDevice(deviceId);
  }

  public async getDeviceObservations(deviceId: string) {
    const observationsList = await this.deviceService.getDeviceObservations(
      deviceId
    );

    if (observationsList.statusCode === 404) return [];

    return observationsList;
  }
}
