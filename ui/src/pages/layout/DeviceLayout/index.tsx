import { PropsWithChildren, useEffect, useState } from "react";
import { DeviceController } from "../../../controllers";
import devicePng from "../../../assets/device.png";
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
} from "@coreui/react";

export function DeviceLayout({ children }: PropsWithChildren) {
  const deviceController = new DeviceController();

  const [deviceList, setDeviceList] = useState<any[]>([]);

  useEffect(() => {
    deviceController.listDevices().then((devices) => setDeviceList(devices));
    console.log("Calling use effect ...");
  });

  return (
    <div>
      {deviceList
        ? deviceList.map((device) => {
            return (
              <div key={device.deviceId}>
                <CCard className="text-center" style={{ width: "18rem" }}>
                  <CCardImage
                    orientation="top"
                    src={devicePng}
                    width={"100rem"}
                  />
                  <CCardBody>
                    <CCardTitle>{device.deviceName}</CCardTitle>
                    <CCardText>{device.description}</CCardText>
                    <CCardText>
                      <small className="text-body-secondary">
                        Created At {device.createdAt}
                      </small>
                    </CCardText>
                    <CButton color="primary" href="#">
                      Details
                    </CButton>
                  </CCardBody>
                </CCard>
              </div>
            );
          })
        : "Loading..."}
    </div>
  );
}
