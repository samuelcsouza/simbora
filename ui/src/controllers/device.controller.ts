import { DeviceService } from "../services/device.service";

export class DeviceController {
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  public async listDevices() {
    return await this.deviceService.listDevices();
  }
}
