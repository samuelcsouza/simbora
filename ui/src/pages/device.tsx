import { PropsWithChildren } from "react";
import { DeviceController } from "../controllers";

export function deviceLayout({ children }: PropsWithChildren) {
  const deviceController = new DeviceController();
}
