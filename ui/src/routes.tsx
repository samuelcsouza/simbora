import { Route, Routes } from "react-router-dom";
import { DeviceLayout } from "./pages/layout/DeviceLayout";
import { DeviceInfoLayout } from "./pages/layout/DeviceInfoLayout";
import { HighwayReportIncident } from "./pages/layout/DeviceReportIncident";

export const RenderRoutes = () => (
  <Routes>
    <Route path="/" element={<DeviceLayout />} />
    <Route path="/highways/:highwayId" element={<DeviceInfoLayout />} />
    <Route
      path="/highways/:highwayId/report"
      element={<HighwayReportIncident />}
    />
  </Routes>
);
