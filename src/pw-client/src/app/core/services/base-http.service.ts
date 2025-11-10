import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HttpOptions {
  headers?: { [header: string]: string | string[] };
  params?: { [param: string]: any };
  context?: HttpContext;
}

@Injectable({ providedIn: 'root' })
export class BaseHttpService {
  protected readonly apiUrl: string = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  /** GET as Promise */
  protected async getRequest<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    const { headers, params, context } = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.get<T>(this.buildUrl(endpoint), { headers, params, context }));
  }

  /** POST as Promise */
  protected async postRequest<T>(endpoint: string, body: any, options?: HttpOptions): Promise<T> {
    const { headers, params, context } = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.post<T>(this.buildUrl(endpoint), body, { headers, params, context }));
  }

  /** PUT as Promise */
  protected async putRequest<T>(endpoint: string, body: any, options?: HttpOptions): Promise<T> {
    const { headers, params, context } = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.put<T>(this.buildUrl(endpoint), body, { headers, params, context }));
  }

  /** DELETE as Promise */
  protected async deleteRequest<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    const { headers, params, context } = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.delete<T>(this.buildUrl(endpoint), { headers, params, context }));
  }

  /** Observable GET */
  protected getObservable<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const { headers, params, context } = this.buildHttpOptions(options);
    return this.http.get<T>(this.buildUrl(endpoint), { headers, params, context });
  }

  /** Observable POST */
  protected postObservable<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    const { headers, params, context } = this.buildHttpOptions(options);
    return this.http.post<T>(this.buildUrl(endpoint), body, { headers, params, context });
  }

  /** URL oluşturma */
  protected buildUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;
  }

  /** HttpOptions */
  protected buildHttpOptions(options?: HttpOptions): { headers: HttpHeaders; params?: HttpParams; context?: HttpContext } {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', ...(options?.headers || {}) });
    const params = options?.params ? this.buildParams(options.params) : undefined;
    return { headers, params, context: options?.context };
  }

  /** Object -> HttpParams */
  protected buildParams(params: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, typeof value === 'object' && !(value instanceof Date) ? JSON.stringify(value) : value.toString());
      }
    });
    return httpParams;
  }
}
