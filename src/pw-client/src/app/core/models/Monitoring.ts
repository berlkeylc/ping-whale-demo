import { MonitorClientModel } from "./MonitorClientModel";

export interface Monitoring extends MonitorClientModel {
  uptimeChart?: any;
  loadtimeChart?: any;
}