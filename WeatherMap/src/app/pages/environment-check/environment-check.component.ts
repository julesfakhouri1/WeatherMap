import { Component, OnInit } from '@angular/core';
import {TestService} from "../../services/test.service";
import {environment} from "../../environments/environment";
import {HttpClientModule} from "@angular/common/http";


@Component({
  selector: 'app-environment-check',
  template: '<p>Check the console for environment values and API tests</p>',
  standalone: true,
  imports: [HttpClientModule]
})
export class EnvironmentCheckComponent implements OnInit {
  constructor(private testService: TestService) {}

  ngOnInit(): void {
    console.log('Firebase API Key:', environment.firebase.apiKey);
    console.log('Firebase Auth Domain:', environment.firebase.authDomain);
    console.log('Firebase Project ID:', environment.firebase.projectId);
    console.log('Firebase Storage Bucket:', environment.firebase.storageBucket);
    console.log('Firebase Messaging Sender ID:', environment.firebase.messagingSenderId);
    console.log('Firebase App ID:', environment.firebase.appId);
    console.log('OpenWeather API Key:', environment.openWeatherApiKey);

    this.testService.testFirebase();
    this.testService.testOpenWeather();
  }
}
