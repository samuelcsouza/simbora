export class HighwayService {
  private _baseUrl = "http://localhost:3000";

  public async listDevices() {
    const endpoint = this._baseUrl + "/highways";

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

  public async getHighway(highwayId: string) {
    const endpoint = `${this._baseUrl}/highways/${highwayId}`;

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

  public async getHighwayObservations(highwayId: string) {
    const endpoint = `${this._baseUrl}/highways/${highwayId}/observations`;

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
}
