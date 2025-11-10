import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: any };
  context?: HttpContext;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  protected readonly apiUrl: string = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  /**
   * GET request
   */
  protected async getRequest<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.get<T>(url, { ...httpOptions, observe: 'body' }));
  }

  /**
   * POST request
   */
  protected async postRequest<T>(endpoint: string, body: any, options?: HttpOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.post<T>(url, body, { ...httpOptions, observe: 'body' }));
  }

  /**
   * PUT request
   */
  protected async putRequest<T>(endpoint: string, body: any, options?: HttpOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.put<T>(url, body, { ...httpOptions, observe: 'body' }));
  }

  /**
   * PATCH request
   */
  protected async patchRequest<T>(endpoint: string, body: any, options?: HttpOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.patch<T>(url, body, { ...httpOptions, observe: 'body' }));
  }

  /**
   * DELETE request
   */
  protected async deleteRequest<T>(endpoint: string, options?: HttpOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return await firstValueFrom(this.http.delete<T>(url, { ...httpOptions, observe: 'body' }));
  }

  /**
   * Observable GET request (for cases where you need Observable instead of Promise)
   */
  protected getObservable<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.get<T>(url, { ...httpOptions, observe: 'body' });
  }

  /**
   * Observable POST request
   */
  protected postObservable<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);
    return this.http.post<T>(url, body, { ...httpOptions, observe: 'body' });
  }

  /**
   * Builds full URL from endpoint
   */
  protected buildUrl(endpoint: string): string {
    // Remove leading slash if endpoint starts with one
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.apiUrl}/${cleanEndpoint}`;
  }

  /**
   * Builds HTTP options with default headers
   */
  protected buildHttpOptions(options?: HttpOptions): { headers?: HttpHeaders; params?: HttpParams; context?: HttpContext } {
    const defaultHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let headers = defaultHeaders;
    if (options?.headers) {
      if (options.headers instanceof HttpHeaders) {
        // Merge headers
        const providedHeaders = options.headers;
        providedHeaders.keys().forEach(key => {
          const values = providedHeaders.getAll(key);
          if (values && values.length > 0) {
            headers = headers.set(key, values.join(','));
          }
        });
      } else {
        // Convert object to HttpHeaders and merge
        const headerObject = options.headers;
        Object.keys(headerObject).forEach(key => {
          const value = headerObject[key];
          if (value !== undefined && value !== null) {
            headers = headers.set(key, Array.isArray(value) ? value.join(',') : value);
          }
        });
      }
    }

    const httpOptions: { headers?: HttpHeaders; params?: HttpParams; context?: HttpContext } = {
      headers: headers
    };

    if (options?.params) {
      httpOptions.params = options.params instanceof HttpParams ? options.params : this.buildParams(options.params);
    }

    if (options?.context) {
      httpOptions.context = options.context;
    }

    return httpOptions;
  }

  /**
   * Builds HttpParams from object
   */
  protected buildParams(params: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && !(value instanceof Date)) {
          httpParams = httpParams.set(key, JSON.stringify(value));
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });
    return httpParams;
  }
}

