import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  private map!: L.Map;

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.5296, -119.8138], // Reno, NV
      zoom: 9
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Circle for 100 miles (~160.9 km)
    L.circle([39.5296, -119.8138], {
      radius: 160934, // in meters
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
