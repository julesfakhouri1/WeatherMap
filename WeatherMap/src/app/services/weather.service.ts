import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from "../environments/environment";
import {HISTORY_DATA_TEST} from "../dummy-data/history-data-test";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:3000/api/search';

  constructor(private http: HttpClient) { }

  getWeather(lat: number, lon: number): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.openWeatherApiKey}`;
    return this.http.get(url);
  }

  saveSearch(searchData: any): Observable<any> {
    return this.http.post(this.apiUrl, searchData);
  }

  getSearchHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  //getSearchHistory(): Observable<any[]> {
    //return of(HISTORY_DATA_TEST);
  //}
}
