import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../_services/localStorage/local-storage.service';

interface Journey {
  id: string;
  startTime: Date;
  endTime: Date;
  distance: number; // in kilometers
  maxSpeed: number; // in km/h
  averageSpeed: number; // in km/h
  duration: string;
  startLocation: string;
  endLocation: string;
}

@Component({
  selector: 'app-last-journey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './last-journey.component.html',
  styleUrl: './last-journey.component.scss'
})

export class LastJourneyComponent {

  constructor(public localStorageService: LocalStorageService) {
    
  }
}
