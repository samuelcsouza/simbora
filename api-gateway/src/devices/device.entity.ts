export interface DevicePayload {
  payload: string;
}

export interface DevicePayloadParsed {
  deviceTimestamp: string;
  deviceValue: string;
  deviceVariable: string;
  deviceUnit: string;
}

export interface DeviceSendDataParams {
  id: string;
}

export interface DeviceSendDataReturnMessage {
  status: string;
  timestamp: number;
}
