import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { GetMonitorsRequest } from '../models/GetMonitorsRequest';
import { GetMonitorsResponse } from '../models/GetMonitorsResponse';
import { SaveMonitorRequest } from '../models/SaveMonitorRequest';
import { SaveMonitorResponse } from '../models/SaveMonitorResponse';

@Injectable({ providedIn: 'root' })
export class MonitoringService extends BaseHttpService {
  constructor(http: HttpClient) {
    super(http);
  }

  async save(model: SaveMonitorRequest): Promise<SaveMonitorResponse> {
    return await this.postRequest<SaveMonitorResponse>('/monitoring', model);
  }

  async get(): Promise<GetMonitorsResponse> {
    return await this.getRequest<GetMonitorsResponse>('/monitoring');
  }

  async getById(monitorId: string): Promise<GetMonitorsResponse> {
    const request: GetMonitorsRequest = {
      UserId: "",
      MonitorId: monitorId
    };

    const params = this.buildParams({ request: JSON.stringify(request) });
    return await this.getRequest<GetMonitorsResponse>(`/monitoring/${monitorId}`, {
      params: params
    });
  }
}
