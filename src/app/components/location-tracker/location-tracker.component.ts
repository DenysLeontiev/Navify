import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import L from 'leaflet';

import { Coordinate } from '../../models/coordinate';
import { TrackingState } from '../../models/enums/trackingState';
import { calculateAverageSpeed, calculateTotalDistanceInMeters } from '../../helpers/calculateDistance';

@Component({
  selector: 'app-location-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-tracker.component.html',
  styleUrl: './location-tracker.component.scss'
})
export class LocationTrackerComponent {

  @ViewChild('speed') speedElement?: ElementRef<HTMLSpanElement>;
  @ViewChild('averageSpeed') averageSpeedElement?: ElementRef<HTMLSpanElement>;
  @ViewChild('distanceCovered') distanceCoveredElement?: ElementRef<HTMLSpanElement>;

  public coordinates: Coordinate[] = [];

  private trackingState: TrackingState = TrackingState.NotTracking;
  private watchId: number | null = null;

  private map!: L.Map;
  private polyline!: L.Polyline;
  private startMarker?: L.Marker;
  private endMarker?: L.Marker;

  private readonly tileLayers = {
    street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }),
    satellite: L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google Satellite'
    })
  };

  private readonly geoOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  constructor() {
    this.setTrackingState(TrackingState.NotTracking);
  }

  public get currentTrackingStateString(): string {
    return TrackingState[this.trackingState];
  }

  public startJourney(): void {
    this.setTrackingState(TrackingState.Tracking);

    this.watchId = navigator.geolocation.watchPosition(
      position => this.onLocationSuccess(position),
      error => this.onLocationError(error),
      this.geoOptions
    );
  }

  public endJourney(): void {
    if (!this.watchId) return;

    this.setTrackingState(TrackingState.Finished);
    navigator.geolocation.clearWatch(this.watchId);
    this.watchId = null;

    this.addEndMarker();
    this.map.fitBounds(this.polyline.getBounds());

    this.coordinates = [];
  }

  private initializeMapIfNeeded(): void {
    if (this.map) return;

    this.map = L.map('map').setView([this.coordinates[0].latitude, this.coordinates[0].longitude], 13);
    this.tileLayers.street.addTo(this.map);
    this.polyline = L.polyline([], { color: 'blue', weight: 5 }).addTo(this.map);
  }

  private onLocationSuccess(position: GeolocationPosition): void {
    const coord = this.mapPositionToCoordinate(position);
    this.coordinates.push(coord);

    this.initializeMapIfNeeded();

    this.updateUI(coord);
    this.updateMap(coord);
  }

  private onLocationError(error: GeolocationPositionError): void {
    this.setTrackingState(TrackingState.Error);
    console.error(`Geolocation error (${error.code}): ${error.message}`);
  }

  private updateUI(coord: Coordinate): void {
    this.setText(`${(coord.speed ?? 0).toFixed(2)} km/h`, this.speedElement);
    this.setText(`${calculateTotalDistanceInMeters(this.coordinates).toFixed(2)} km`, this.distanceCoveredElement);
    this.setText(`${calculateAverageSpeed(this.coordinates).toFixed(2)} km/h`, this.averageSpeedElement);
  }

  private updateMap(coord: Coordinate): void {
    const latLng: [number, number] = [coord.latitude, coord.longitude];
    this.polyline.addLatLng(latLng);

    if (this.coordinates.length === 1) {
      this.startMarker?.remove();
      this.startMarker = L.marker(latLng).addTo(this.map).bindPopup('Start').openPopup();
      this.map.setView(latLng, 15);
    }
  }

  private addEndMarker(): void {
    if (this.coordinates.length < 2) return;

    this.endMarker?.remove();
    const lastCoord = this.coordinates[this.coordinates.length - 1];
    const latLng: [number, number] = [lastCoord.latitude, lastCoord.longitude];

    this.endMarker = L.marker(latLng).addTo(this.map).bindPopup('End');
  }

  private setText(text: string, elementRef?: ElementRef<HTMLSpanElement>): void {
    if (elementRef) {
      elementRef.nativeElement.innerText = text;
    }
  }

  private mapPositionToCoordinate(position: GeolocationPosition): Coordinate {
    const { latitude, longitude, speed, altitude, altitudeAccuracy, heading } = position.coords;
    return { latitude, longitude, speed, altitude, altitudeAccuracy, heading };
  }

  private setTrackingState(state: TrackingState): void {
    this.trackingState = state;
  }
}
