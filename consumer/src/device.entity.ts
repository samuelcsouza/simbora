export interface DevicePayload {
  payload: string;
}

export interface DevicePayloadParsed {
  deviceTimestamp: string;
  deviceValue: string;
  deviceVariable: string;
  deviceUnit: string;
}
