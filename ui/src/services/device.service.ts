export class DeviceService {
  private _baseUrl = process.env.API_URL || "http://nestjs-app:3000";

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

  public async getDevice(deviceId: string) {
    const endpoint = `${this._baseUrl}/devices/${deviceId}`;

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

  public async getDeviceObservations(deviceId: string) {
    const endpoint = `${this._baseUrl}/devices/${deviceId}/observations`;

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

  public async listDeviceObservations(deviceId: string) {}
}
