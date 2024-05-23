import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MapComponent} from "../../components/map/map.component";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, MapComponent]
})
export class HomeComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  showHistory: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  disconnect(): void {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']); // Redirect to login page after logout
    }).catch((error: any) => {
      console.error('Logout error', error);
    });
  }

  searchAddress(event: any): void {
    const input = event.target.value;
    if (this.mapComponent && input) {
      this.mapComponent.searchAddress(input);
    }
  }
}
