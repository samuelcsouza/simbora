export class DeviceService {
  private _baseUrl = "http://localhost:3000";

  public async listDevices() {
    const endpoint = this._baseUrl + "/devices";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return await fetch(endpoint, options)
      .then(async (response) => {
        return await response.json();
      })
      .catch((error) => {
        throw error;
      });
  }

  public async getDevice(deviceId: string) {}

  public async listDeviceObservations(deviceId: string) {}
}
