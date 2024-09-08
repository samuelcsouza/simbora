import { Route, Routes } from "react-router-dom";
import { DeviceLayout } from "./pages/layout/DeviceLayout";
import { DeviceInfoLayout } from "./pages/layout/DeviceInfoLayout";

export const RenderRoutes = () => (
  <Routes>
    <Route path="/" element={<DeviceLayout />} />
    <Route path="/devices/:deviceId" element={<DeviceInfoLayout />} />
  </Routes>
);
