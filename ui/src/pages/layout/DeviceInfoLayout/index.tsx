/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, useEffect, useState } from "react";
import { DeviceController } from "../../../controllers";

import { useNavigate, useParams } from "react-router-dom";

export function DeviceInfoLayout({ children }: PropsWithChildren) {
  const { deviceId } = useParams();
  const navigate = useNavigate();

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

  const handleGoBackClick = () => {
    navigate("/");
  };

  return (
    <div>
      <>Hello from device {deviceId} info!</>
      <p>Device {JSON.stringify(deviceMetadata)}</p>
      <hr />
      <p>Observações {JSON.stringify(deviceObservations)}</p>

      <button onClick={handleGoBackClick}>Return</button>
    </div>
  );
}
