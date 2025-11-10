export interface MonitorClientModel {
  monitorId: string;
  createdDate: string;
  lastCheckDate?: string;
  monitorStatus: string;
  name: string;
  testStatus: string;
  updatedDate?: string;
  url: string;
  upTime: number;
  upTimes: number[];
  downTime: number;
  downTimePercent: number;
  loadTime: number;
  loadTimes: number[];
  totalMonitoredTime: number;
  stepStatus: string;
  stepStatusText: string;
}

