import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { GetMonitorsRequest } from '../models/GetMonitorsRequest';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private apiUrl: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.apiUrl = (this.auth as any).apiUrl || '';
  }

  async save(model: any): Promise<any> {
    const url = `${this.apiUrl}/monitoring`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = (this.auth as any).getToken ? (this.auth as any).getToken() : (this.auth as any).token;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return await firstValueFrom(this.http.post(url, model, { headers }));
  }

  async get(): Promise<any> {
    const url = `${this.apiUrl}/monitoring`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = (this.auth as any).getToken ? (this.auth as any).getToken() : (this.auth as any).token;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    

    return await firstValueFrom(this.http.get(url, { headers }));
  }

  async getById(monitorId: string): Promise<any> {
    const url = `${this.apiUrl}/monitoring/${monitorId}`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = (this.auth as any).getToken ? (this.auth as any).getToken() : (this.auth as any).token;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    let request: GetMonitorsRequest = {
        UserId: "",
        MonitorId: monitorId
      };

    return await firstValueFrom(this.http.get(url, { headers , params: { request: JSON.stringify(request) }}));
  }
}
