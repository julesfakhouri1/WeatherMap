import { Component, OnInit, Inject, PLATFORM_ID, Input, OnChanges, SimpleChanges } from '@angular/core';
import {CommonModule, formatDate, isPlatformBrowser} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from '../../services/weather.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class MapComponent implements OnInit, OnChanges {
  @Input() showHistory: boolean = false;
  private map!: any;
  private provider: any;
  public searchHistory: any[] = [];

  constructor(
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }

      this.fetchHistory();

  }

  ngOnChanges(changes: SimpleChanges): void {
      if (this.showHistory) {
        this.fetchHistory();
      }
  }

  private async initMap(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      const { OpenStreetMapProvider } = await import('leaflet-geosearch');
      this.provider = new OpenStreetMapProvider();

      // Fix for default icon paths
      const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
      const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
      const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
      const defaultIcon = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = defaultIcon;

      this.map = L.map('map', {
        center: [51.505, -0.09],
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.addGeolocation(L);
    }
  }

  private async addGeolocation(L: any): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      if (environment.production || location.protocol === 'https:') {
        this.map.locate({ setView: true, maxZoom: 16 });

        const marker = (await L).marker([0, 0]);
        marker.addTo(this.map);

        this.map.on('locationfound', async (e: any) => {
          marker.setLatLng(e.latlng);
          marker.bindPopup('You are here').openPopup();

          const { lat, lng } = e.latlng;
          this.weatherService.getWeather(lat, lng).subscribe(data => {
            const weatherInfo = this.formatWeatherData(data);
            marker.bindPopup(weatherInfo).openPopup();
          });
        });

        this.map.on('locationerror', (e: any) => {
          alert(e.message);
        });
      } else {
        // Mock location for development
        const lat = 51.505;
        const lng = -0.09;
        const mockLatLng = (await L).latLng(lat, lng);

        const marker = (await L).marker(mockLatLng).addTo(this.map);
        marker.bindPopup('Mock location').openPopup();

        this.weatherService.getWeather(lat, lng).subscribe(data => {
          const weatherInfo = this.formatWeatherData(data);
          marker.bindPopup(weatherInfo).openPopup();
        });

        console.warn('Using mock location for development mode without HTTPS');
      }
    }
  }

  async searchAddress(address: string): Promise<void> {
    if (address && isPlatformBrowser(this.platformId)) {
      const results = await this.provider.search({ query: address });
      if (results && results.length > 0) {
        const result = results[0];
        const L = await import('leaflet');
        const latLng = L.latLng(result.y, result.x);

        const marker = L.marker(latLng).addTo(this.map);
        this.map.setView(latLng, 13);

        this.weatherService.getWeather(result.y, result.x).subscribe(data => {
          const weatherInfo = this.formatWeatherData(data);
          marker.bindPopup(weatherInfo).openPopup();

          // Save search history
          const searchHistory = {
            address: result.label,
            latitude: result.y,
            longitude: result.x,
            weather: data
          };
          this.weatherService.saveSearch(searchHistory).subscribe();
        });
      }
    }
  }

  private fetchHistory(): void {
    this.weatherService.getSearchHistory().subscribe(history => {
      this.searchHistory = history;
    });
  }

  async locateFromHistory(history: any): Promise<void> {
    const L = await import('leaflet');
    const latLng = L.latLng(history.latitude, history.longitude);
    const marker = L.marker(latLng).addTo(this.map);
    this.map.setView(latLng, 13);
    marker.bindPopup(this.formatWeatherDataHistory(history.weather)).openPopup();
  }

   formatWeatherData(data: any): string {
      const tempCelsius = (kelvin: number) => (kelvin - 273.15).toFixed(2);
      console.log(data);
        return `
        <div>
          <p><strong>Temperature:</strong> ${tempCelsius(data.main.temp)}°C</p>
          <p><strong>Max:</strong> ${tempCelsius(data.main.temp_max)}°C</p>
          <p><strong>Min:</strong> ${tempCelsius(data.main.temp_min)}°C</p>
          <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
          <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
          <p><strong>Pressure:</strong> ${data.main.pressure} hPa</p>
          <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        </div>
      `;
  }

  formatWeatherDataHistory(data: any): string {
    const tempCelsius = (kelvin: number) => (kelvin - 273.15).toFixed(2);
    console.log(data);
    return `
        <div>
          <p><strong>Temperature:</strong> ${tempCelsius(data.temperature)}°C</p>
          <p><strong>Max:</strong> ${tempCelsius(data.temperature_max)}°C</p>
          <p><strong>Min:</strong> ${tempCelsius(data.temperature_min)}°C</p>
          <p><strong>Wind:</strong> ${data.wind_speed} m/s</p>
          <p><strong>Humidity:</strong> ${data.humidity}%</p>
          <p><strong>Pressure:</strong> ${data.pressure} hPa</p>
          <p><strong>Weather:</strong> ${data.description}</p>
        </div>
      `;
  }

  convertToString(timestamp: any): string {
    if (timestamp && timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000);
      return formatDate(date, 'dd/MM/yyyy hh:mm:ss', 'en-US');
    }
    return '';
  }
}
