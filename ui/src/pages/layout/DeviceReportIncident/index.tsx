/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren } from "react";
import { HighwayController } from "../../../controllers";
import { useNavigate, useParams } from "react-router-dom";
import "./style.css";

export function HighwayReportIncident({ children }: PropsWithChildren) {
  const { highwayId } = useParams();
  const navigate = useNavigate();

  const highwayController = new HighwayController();

  return <>oi! {highwayId}</>;
}
