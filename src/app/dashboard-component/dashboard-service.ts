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

}
