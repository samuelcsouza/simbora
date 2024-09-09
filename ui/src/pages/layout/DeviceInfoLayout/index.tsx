/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, useEffect, useState } from "react";
import { DeviceController } from "../../../controllers";
import { useNavigate, useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CTable,
} from "@coreui/react";
import deviceImage from "../../../assets/download.png";
import "./style.css";

export function DeviceInfoLayout({ children }: PropsWithChildren) {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const deviceController = new DeviceController();

  const [deviceMetadata, setDeviceMetadata] = useState<any>([]);
  const [deviceObservations, setDeviceObservations] = useState<any[]>([]);

  useEffect(() => {
    deviceController.getDevice(deviceId!).then((device) => {
      if (device?.statusCode === 404) {
        navigate("/");
      }
      setDeviceMetadata(device);
    });

    deviceController.getDeviceObservations(deviceId!).then((observations) => {
      const _observationsTable = observations?.map((obs: any) => {
        obs._cellProps = { id: { scope: "row" } };
        return obs;
      });

      setDeviceObservations(_observationsTable);
    });
  }, []);

  const handleGoBackClick = () => {
    navigate("/");
  };

  const tableColumns = [
    {
      key: "createdAt",
      label: "Time",
      _props: { scope: "col" },
    },
    {
      key: "variable",
      label: "Variable",
      _props: { scope: "col" },
    },
    {
      key: "value",
      label: "Value",
      _props: { scope: "col" },
    },
    {
      key: "unit",
      label: "Unit",
      _props: { scope: "col" },
    },
  ];

  return (
    <div className="device-info-layout">
      <CCard className="mb-3" style={{ maxWidth: "100%" }}>
        <CRow className="g-0">
          <CCol md={4}>
            <CCardImage src={deviceImage} width={"150rem"} />
          </CCol>
          <CCol md={8}>
            <CCardBody>
              <CCardTitle>{deviceMetadata.deviceName}</CCardTitle>
              <CCardText>{deviceMetadata.description}</CCardText>
              <CCardText>
                <small className="text-body-secondary">
                  Created at {deviceMetadata.createdAt}
                </small>
              </CCardText>
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>
      <div style={{ marginBottom: "5rem" }} />

      <div className="row">
        <h1 style={{ marginBottom: "2rem" }}>Observations</h1>
        <CTable columns={tableColumns} items={deviceObservations} />

        <button className="btn btn-primary" onClick={handleGoBackClick}>
          Return
        </button>
      </div>
    </div>
  );
}
