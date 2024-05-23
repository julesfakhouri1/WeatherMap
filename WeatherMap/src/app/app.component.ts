import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {EnvironmentCheckComponent} from "./pages/environment-check/environment-check.component";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EnvironmentCheckComponent,
    HttpClientModule,
  ],
  providers:[HttpClientModule]
})
export class AppComponent {
  title = 'weatherMap';
}
