import { Route, Routes } from "react-router-dom";
import { DeviceLayout } from "./pages/layout/DeviceLayout";

export const RenderRoutes = () => (
  <Routes>
    <Route path="/" element={<DeviceLayout />} />
    <Route path="/devices/:id" element={<>oi!</>} />
  </Routes>
);
