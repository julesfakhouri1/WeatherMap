import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private http: HttpClient, private auth: Auth) {}

  testFirebase() {
    console.log('Firebase Auth Instance:', this.auth);
  }

  testOpenWeather() {
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${environment.openWeatherApiKey}`;
    this.http.get(testUrl).subscribe(response => {
      console.log('OpenWeather API Response:', response);
    }, error => {
      console.error('OpenWeather API Error:', error);
    });
  }
}
