import { HighwayService } from "../services/highway.service";

export class HighwayController {
  private highwayService: HighwayService;

  constructor() {
    this.highwayService = new HighwayService();
  }

  public async listHighways() {
    return await this.highwayService.listHighways();
  }

  public async getHighway(highwayId: string) {
    return await this.highwayService.getHighway(highwayId);
  }

  public async getHighwayIncidents(highwayId: string) {
    const observationsList = await this.highwayService.getHighwayObservations(
      highwayId
    );

    if (observationsList.statusCode === 404) return [];

    return observationsList;
  }

  public async reportIncident(highwayId: string, payload: string) {
    const fullPayload = new Date().getTime().toString() + ";" + payload;
    const errorResponse = {
      hCity: "Unavailable",
      hDirection: "Error",
      hDistance: "Parser Error",
      hIncident: "Invalid payload format",
    };

    try {
      const response = await this.highwayService.sendHighwayIncidents(
        highwayId,
        fullPayload
      );

      delete response.message.hCreatedAt;

      if (response.message.hDistance === errorResponse.hDistance) {
        console.error(
          "Error when report incident: Invalid parameters provided"
        );
        return null;
      }

      return response;
    } catch (error) {
      const e = error as Error;
      console.error("Error when report incident", e?.message);
      return null;
    }
  }
}
