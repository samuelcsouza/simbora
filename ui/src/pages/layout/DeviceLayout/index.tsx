/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, useEffect, useState } from "react";
import { DeviceController } from "../../../controllers";
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import deviceImage from "../../../assets/download.png";
import "./style.css";

export function DeviceLayout({ children }: PropsWithChildren) {
  const deviceController = new DeviceController();

  const navigate = useNavigate();

  const [deviceList, setDeviceList] = useState<any[]>([]);

  useEffect(() => {
    deviceController.listDevices().then((devices) => {
      setDeviceList(devices);
    });
  }, []);

  const handleClick = (deviceId: string) => {
    navigate(`/devices/${deviceId}`);
  };

  return (
    <div className="device-layout">
      <CRow>
        {deviceList
          ? deviceList.map((device) => {
              return (
                <CCol sm={6} key={device.deviceId}>
                  <CCard className="text-center" style={{ width: "15rem" }}>
                    <CCardImage orientation="top" src={deviceImage} />
                    <CCardBody>
                      <CCardTitle>{device.deviceName}</CCardTitle>
                      <CCardText>{device.description}</CCardText>
                      <CButton
                        color="primary"
                        onClick={() => handleClick(device.deviceId)}
                      >
                        Details
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>
              );
            })
          : "Loading..."}
      </CRow>
    </div>
  );
}
