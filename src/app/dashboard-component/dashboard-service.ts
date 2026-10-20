import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoginService} from '../../services/login-service';
import {Observable} from 'rxjs';


export interface Location{
  id: string;
  name: string;
  description: string;
}
export interface Sublocation{
  id: string;
  name: string;
  description: string;
}
export interface TimeLimitsRequest {
    sublocation_ids: Array<string>,
}

export interface TimeLimitsResponse {
    earliest_datetime: string | null,
    latest_datetime: string | null,
}
export type BinInterval = 'minutes' | 'hours' | 'days' | 'weeks' | 'months';

export interface EventBinRequest {
    sublocation_ids: string[];
    start_datetime: string; // ISO 8601 string format
    end_datetime: string;   // ISO 8601 string format
    interval: BinInterval;
}

export interface BinResponse {
    start_time: string;
    end_time: string;
    count: number;
}
export interface EventDetailsRequest {
    sublocation_ids: string[],
    start_datetime: string,
    end_datetime: string,
}

export interface BinEventDetail {
    id: string;
    camera_id: string;
    date: string; // ISO 8601 datetime string (from DateTimeWithTimeZone)
    plate: string;
    image: string;
    plate_image: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}`;
  private readonly loginService = inject(LoginService);

  private authHeaders(): HttpHeaders {
    const token = this.loginService.token?.() ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`, { headers: this.authHeaders() });
  }
  getSublocations(location_id:string): Observable<Sublocation[]> {
    return this.http.get<Sublocation[]>(`${this.apiUrl}/locations/${location_id}/sublocations`, { headers: this.authHeaders() });
  }
  getTimeLimits(sublocation_ids:Array<string>): Observable<TimeLimitsResponse> {
      const body:TimeLimitsRequest = {sublocation_ids};
      return this.http.post<TimeLimitsResponse>(`${this.apiUrl}/time_limits`, body, { headers: this.authHeaders() });
  }
  getEvents(req: EventBinRequest): Observable<BinResponse[]> {
    return this.http.post<BinResponse[]>(`${this.apiUrl}/binned_events`, req, { headers: this.authHeaders() });
  }
  getBinEventDetails(req: EventDetailsRequest): Observable<BinEventDetail[]> {
      return this.http.post<BinEventDetail[]>(`${this.apiUrl}/bin_events_details`, req, { headers: this.authHeaders() });
  }

}
