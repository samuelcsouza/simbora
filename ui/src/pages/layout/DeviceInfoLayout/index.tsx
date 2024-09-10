/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, useEffect, useState } from "react";
import { HighwayController } from "../../../controllers";
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
import deviceImage from "../../../assets/image.png";
import "./style.css";

export function DeviceInfoLayout({ children }: PropsWithChildren) {
  const { highwayId } = useParams();
  const navigate = useNavigate();

  const highwayController = new HighwayController();

  const [highwayMetadata, setHighwayMetadata] = useState<any>([]);
  const [highwayObservations, setHighwayObservations] = useState<any[]>([]);

  useEffect(() => {
    highwayController.getDevice(highwayId!).then((device) => {
      if (device?.statusCode === 404) {
        navigate("/");
      }
      setHighwayMetadata(device);
    });

    highwayController.getDeviceObservations(highwayId!).then((observations) => {
      const _observationsTable = observations?.map((obs: any) => {
        obs._cellProps = { id: { scope: "row" } };
        return obs;
      });

      setHighwayObservations(_observationsTable);
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
      key: "incident",
      label: "Incident",
      _props: { scope: "col" },
    },
    {
      key: "distance",
      label: "Distance",
      _props: { scope: "col" },
    },
    {
      key: "direction",
      label: "Direction",
      _props: { scope: "col" },
    },

    {
      key: "city",
      label: "City",
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
              <CCardTitle>{highwayMetadata.highwayName}</CCardTitle>
              <CCardText>{highwayMetadata.description}</CCardText>
              <CCardText>
                <small className="text-body-secondary">
                  Created at {highwayMetadata.createdAt}
                </small>
              </CCardText>
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>
      <div style={{ marginBottom: "5rem" }} />

      <div className="row">
        <h1 style={{ marginBottom: "2rem" }}>Observations</h1>
        <CTable columns={tableColumns} items={highwayObservations} />

        <button className="btn btn-primary" onClick={handleGoBackClick}>
          Return
        </button>
      </div>
    </div>
  );
}
