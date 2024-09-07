export interface DevicePayload {
  payload: string;
}

export interface DeviceSendDataParams {
  id: string;
}

export interface DeviceSendDataReturnMessage {
  status: string;
  timestamp: number;
}
