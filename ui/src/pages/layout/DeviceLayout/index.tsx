/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, useEffect, useState } from "react";
import { HighwayController } from "../../../controllers";
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
import deviceImage from "../../../assets/image.png";
import "./style.css";

export function DeviceLayout({ children }: PropsWithChildren) {
  const highwayController = new HighwayController();

  const navigate = useNavigate();

  const [highwayList, setHighwayList] = useState<any[]>([]);

  useEffect(() => {
    highwayController.listDevices().then((highways) => {
      setHighwayList(highways);
    });
  }, []);

  const handleClick = (highwayId: string) => {
    navigate(`/highways/${highwayId}`);
  };

  return (
    <div className="device-layout">
      <CRow>
        {highwayList
          ? highwayList.map((highway) => {
              return (
                <CCol sm={6} key={highway.highwayId}>
                  <CCard className="text-center" style={{ width: "15rem" }}>
                    <CCardImage orientation="top" src={deviceImage} />
                    <CCardBody>
                      <CCardTitle>{highway.highwayName}</CCardTitle>
                      <CCardText>{highway.description}</CCardText>
                      <CButton
                        color="primary"
                        onClick={() => handleClick(highway.highwayId)}
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
