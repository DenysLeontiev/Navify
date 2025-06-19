import { Component, ElementRef, ViewChild } from '@angular/core';
import { Coordinate } from '../../models/coordinate';
import L from 'leaflet';
import { CommonModule } from '@angular/common';
import { TrackingState } from '../../models/enums/trackingState';

@Component({
  selector: 'app-location-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-tracker.component.html',
  styleUrl: './location-tracker.component.scss'
})
export class LocationTrackerComponent {

  @ViewChild('speed') speedElement?: ElementRef<HTMLSpanElement>;
  @ViewChild('distanceCovered') distanceCoveredElement?: ElementRef<HTMLSpanElement>;

  public coordinates: Coordinate[] = [];

  private currentTrackingState: TrackingState = TrackingState.NotTracking;

  private watchId: number | null = null;

  private map!: L.Map;
  private polyline!: L.Polyline;
  private startMarker!: L.Marker;
  private endMarker!: L.Marker;

  private layers = {
    street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }),
    satellite: L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google Satellite',
    })
  };

  private options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  constructor() {
    this.setTrackingStatus(TrackingState.NotTracking);
  }

  public startJourney(): void {
    this.setTrackingStatus(TrackingState.Tracking);
    if (!this.map) {
      this.map = L.map('map').setView([50.45, 30.52], 13);
      this.layers.street.addTo(this.map);

      this.polyline = L.polyline([], { color: 'blue', weight: 5 }).addTo(this.map);
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.successWatchLocation(position),
      (error) => this.errorWatchLocation(error),
      this.options
    );
  }

  public endJourney(): void {
    if (this.watchId) {
      this.setTrackingStatus(TrackingState.Finished);
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;

      // Add final marker and zoom to path
      const latLngs = this.coordinates.map(c => [c.latitude, c.longitude]) as [number, number][];
      if (latLngs.length > 1) {
        if (this.endMarker) {
          this.map.removeLayer(this.endMarker);
        }
        this.endMarker = L.marker(latLngs[latLngs.length - 1]).addTo(this.map).bindPopup('End');

        this.map.fitBounds(this.polyline.getBounds());
      }

      this.coordinates = [];
    }
  }

  private successWatchLocation(position: GeolocationPosition): void {
    const coordinate: Coordinate = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
    };

    this.coordinates.push(coordinate);

    if (this.speedElement && this.distanceCoveredElement) {
      this.speedElement.nativeElement.innerText = coordinate.speed?.toFixed(2)!;

      let distance = 0;

      for (let i = 0; i < this.coordinates.length - 1; i++) {
        distance += this.calculateDistance(this.coordinates[i], this.coordinates[i + 1]);
      }

      this.distanceCoveredElement.nativeElement.innerText = distance?.toFixed(2)!;
    }

    this.buildMap(coordinate);
  }

  private buildMap(coordinate: Coordinate): void {
    const latLng: [number, number] = [coordinate.latitude, coordinate.longitude];

    this.polyline.addLatLng(latLng);


    if (this.coordinates.length === 1) {
      if (this.startMarker) this.map.removeLayer(this.startMarker);
      this.startMarker = L.marker(latLng).addTo(this.map).bindPopup('Start').openPopup();
      this.map.setView(latLng, 15);
    }
  }

  private errorWatchLocation(error: GeolocationPositionError): void {
    this.setTrackingStatus(TrackingState.Error);
    console.error(`ERROR(${error.code}): ${error.message}`);
  }

  private calculateDistance(firstCoordinate: Coordinate, secondCoordinate: Coordinate): number {
    var R = 6371000; // Radius of the earth in m
    var dLat = this.deg2rad(firstCoordinate.latitude - secondCoordinate.latitude);  // deg2rad below
    var dLon = this.deg2rad(firstCoordinate.longitude - secondCoordinate.longitude);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(firstCoordinate.latitude)) * Math.cos(this.deg2rad(secondCoordinate.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  get currentTrackingStateString(): string {
    return TrackingState[this.currentTrackingState]; // Converts enum number to string name
  }

  private setTrackingStatus(trackingStatus: TrackingState): void {
    this.currentTrackingState = trackingStatus;
  }
}
