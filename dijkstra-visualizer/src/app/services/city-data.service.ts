import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityDataService {

  private dataUrl = 'assets/city-distances.json';

  constructor(private http: HttpClient) { }

  getCityData(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
}