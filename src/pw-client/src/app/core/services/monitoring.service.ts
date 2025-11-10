import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { GetMonitorsRequest } from '../models/GetMonitorsRequest';

@Injectable({ providedIn: 'root' })
export class MonitoringService extends BaseHttpService {
  constructor(http: HttpClient) {
    super(http);
  }

  async save(model: any): Promise<any> {
    return await this.postRequest('/monitoring', model);
  }

  async get(): Promise<any> {
    return await this.getRequest('/monitoring');
  }

  async getById(monitorId: string): Promise<any> {
    const request: GetMonitorsRequest = {
      UserId: "",
      MonitorId: monitorId
    };

    const params = this.buildParams({ request: JSON.stringify(request) });
    return await this.getRequest(`/monitoring/${monitorId}`, {
      params: params
    });
  }
}
