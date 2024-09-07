/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, useEffect, useState } from "react";
import { DeviceController } from "../../../controllers";

import { useParams } from "react-router-dom";

export function DeviceInfoLayout({ children }: PropsWithChildren) {
  const { deviceId } = useParams();

  const deviceController = new DeviceController();

  const [deviceMetadata, setdeviceMetadata] = useState<any>([]);
  const [deviceObservations, setDeviceObservations] = useState<any[]>([]);

  useEffect(() => {
    deviceController
      .getDevice(deviceId!)
      .then((device) => setdeviceMetadata(device));

    deviceController
      .getDeviceObservations(deviceId!)
      .then((observations) => setDeviceObservations(observations));
  }, []);

  return (
    <div>
      <>Hello from device {deviceId} info!</>
      <p>
        Device kasjdkajsd
        {JSON.stringify(deviceMetadata)}
      </p>
      <hr />
      <p>
        Observações jota jota jota ká
        {JSON.stringify(deviceObservations)}
      </p>
    </div>
  );
}
