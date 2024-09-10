/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { HighwayController } from "../../../controllers";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";
import { CButton, CCol, CForm, CFormInput, CRow } from "@coreui/react";

export function HighwayReportIncident({ children }: PropsWithChildren) {
  const { highwayId } = useParams();
  const navigate = useNavigate();
  const [highwayName, setHighwayName] = useState<any>(highwayId);

  const highwayController = new HighwayController();

  const refIncident = useRef<any>();
  const refKm = useRef<any>();
  const refDirection = useRef<any>();
  const refCity = useRef<any>();

  const handleSubmit = async (event: any) => {
    const payload = [
      refIncident.current?.value || "",
      refKm.current?.value || "",
      refDirection.current?.value || "",
      refCity.current?.value || "",
    ].join(";");

    const isReported = await highwayController.reportIncident(
      highwayId!,
      payload
    );

    if (!isReported) {
      alert("Error when report incident. Check logs for more info");
    }

    event.preventDefault();

    navigate(`/highways/${highwayId}`);
  };

  const handleCancelAction = () => {
    navigate(`/highways/${highwayId}`);
  };

  useEffect(() => {
    highwayController.getHighway(highwayId!).then((device) => {
      if (device?.statusCode === 404) {
        navigate("/");
      }
      setHighwayName(device);
    });
  }, []);

  return (
    <>
      <div className="device-info-layout">
        <div className="title-report">
          <h1 style={{ marginBottom: "1rem" }}>Report Incident</h1>

          <i>{highwayName?.highwayName}</i>
        </div>

        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol xs>
              <CFormInput
                id="incident"
                placeholder="Incident"
                aria-label="Incident"
                ref={refIncident}
              />
            </CCol>
            <CCol xs>
              <CFormInput
                id="km"
                placeholder="Km"
                aria-label="Km"
                ref={refKm}
              />
            </CCol>
            <CCol xs>
              <CFormInput
                id="direction"
                placeholder="Direction"
                aria-label="Direction"
                ref={refDirection}
              />
            </CCol>
            <CCol xs>
              <CFormInput
                id="city"
                placeholder="City"
                aria-label="City"
                ref={refCity}
              />
            </CCol>
          </CRow>
        </CForm>
      </div>

      <div style={{ marginBottom: "1rem" }} />

      <div className="row">
        <CButton color="primary" onClick={handleCancelAction}>
          Cancel
        </CButton>

        <CButton color="primary" type="submit" onClick={handleSubmit}>
          Report
        </CButton>
      </div>
    </>
  );
}
// format: TIMESTAMP;INCIDENT;DISTANCE;DIRECTION;CITY
