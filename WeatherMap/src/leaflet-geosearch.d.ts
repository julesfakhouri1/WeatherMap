// src/leaflet-geosearch.d.ts
declare module 'leaflet-geosearch' {
  import * as L from 'leaflet';

  export class GeoSearchControl extends L.Control {
    constructor(options: GeoSearchControlOptions);
  }

  export class OpenStreetMapProvider extends Provider {}

  export interface GeoSearchControlOptions {
    provider: Provider;
    style?: string;
    showMarker?: boolean;
    retainZoomLevel?: boolean;
    animateZoom?: boolean;
    autoClose?: boolean;
    searchLabel?: string;
    keepResult?: boolean;
  }

  export class Provider {
    search(query: string): Promise<SearchResult[]>;
  }

  export interface SearchResult {
    x: number;
    y: number;
    label: string;
    bounds: L.LatLngBounds;
  }
}
