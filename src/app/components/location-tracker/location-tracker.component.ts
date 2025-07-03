import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import L from 'leaflet';

import { Coordinate } from '../../models/coordinate';
import { TrackingState } from '../../models/enums/trackingState';
import { calculateAverageSpeed, calculateTotalDistanceInMeters } from '../../helpers/calculateDistance';
import { greenIcon, redIcon } from '../../helpers/leafIcons';
import { tileLayers } from '../../helpers/mapTileLayer';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-location-tracker',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './location-tracker.component.html',
  styleUrl: './location-tracker.component.scss'
})
export class LocationTrackerComponent implements AfterViewInit {

  @ViewChild('speed') speedElement?: ElementRef<HTMLSpanElement>;
  @ViewChild('maxSpeed') maxSpeedElement?: ElementRef<HTMLSpanElement>;
  @ViewChild('averageSpeed') averageSpeedElement?: ElementRef<HTMLSpanElement>;
  @ViewChild('distanceCovered') distanceCoveredElement?: ElementRef<HTMLSpanElement>;

  public TrackingState = TrackingState;
  public coordinates: Coordinate[] = [];

  public currentTrackingState: TrackingState = TrackingState.NotTracking;
  private watchId: number | null = null;

  private map!: L.Map;
  private polyline!: L.Polyline;

  private readonly geoOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  private tileLayers = tileLayers;
  private currentTileLayer: L.TileLayer = tileLayers.street;

  constructor(public translate: TranslateService) {
    this.setTrackingState(TrackingState.NotTracking);
  }

  ngAfterViewInit(): void {
    this.initializeMapIfNeeded();
  }

  public onMapTypeChange(event: Event): void {
    const selectedType = (event.target as HTMLSelectElement).value as keyof typeof this.tileLayers;

    if (this.map && this.tileLayers[selectedType]) {
      this.map.removeLayer(this.currentTileLayer);
      this.currentTileLayer = this.tileLayers[selectedType];
      this.currentTileLayer.addTo(this.map);
    }
  }

  public get currentTrackingStateString(): string {
    return TrackingState[this.currentTrackingState];
  }

  public startJourney(): void {

    this.coordinates = [];
    this.updateUI(null);
    this.resetMap();
    this.setTrackingState(TrackingState.Tracking);

    this.watchId = navigator.geolocation.watchPosition(
      position => this.onLocationSuccess(position),
      error => this.onLocationError(error),
      this.geoOptions
    );
  }

  private resetMap(): void {
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }

    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    this.polyline = L.polyline([], { color: 'blue', weight: 5 }).addTo(this.map);
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

    window.navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      this.map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
      this.tileLayers.street.addTo(this.map);
      this.polyline = L.polyline([], { color: 'blue', weight: 5 }).addTo(this.map);
    });
  }

  private onLocationSuccess(position: GeolocationPosition): void {
    const coord = this.mapPositionToCoordinate(position);
    this.coordinates.push(coord);

    this.updateUI(coord);
    this.updateMap(coord);
  }

  private onLocationError(error: GeolocationPositionError): void {
    this.setTrackingState(TrackingState.Error);
    console.error(`Geolocation error (${error.code}): ${error.message}`);
  }

  private updateUI(coord: Coordinate | null): void {

    const msToKhConst: number = 3.6;
    let speed: number = coord ? coord.speed! * msToKhConst : 0;
    let maxSpeed: number = Math.max(...this.coordinates.map(x => x.speed!)) * msToKhConst;
    let averageSpeed: number = calculateAverageSpeed(this.coordinates) * msToKhConst;
    let totalDistanceInMeters: number = calculateTotalDistanceInMeters(this.coordinates) / 1000;

    this.setText(`${speed.toFixed(2)} km/h`, this.speedElement);
    this.setText(`${maxSpeed.toFixed(2)} km/h`, this.maxSpeedElement);
    this.setText(`${averageSpeed.toFixed(2)} km/h`, this.averageSpeedElement);
    this.setText(`${totalDistanceInMeters.toFixed(2)} km`, this.distanceCoveredElement);
  }

  private updateMap(coord: Coordinate): void {
    const latLng: [number, number] = [coord.latitude, coord.longitude];
    this.polyline.addLatLng(latLng);

    if (this.coordinates.length === 1) {
      this.translate.get('start').subscribe((translatedLabel: string) => {
        L.marker(latLng, { icon: greenIcon }).addTo(this.map).bindTooltip(translatedLabel).openPopup();
        this.map.setView(latLng, 15);
      });
    }
  }

  private addEndMarker(): void {
    if (this.coordinates.length < 2) return;

    const lastCoord = this.coordinates[this.coordinates.length - 1];
    const latLng: [number, number] = [lastCoord.latitude, lastCoord.longitude];

    if (this.coordinates.length === 1) {
      this.translate.get('end').subscribe((translatedLabel: string) => {
        L.marker(latLng, { icon: redIcon }).addTo(this.map).bindTooltip(translatedLabel);
      });
    }
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
    this.currentTrackingState = state;
  }
}
