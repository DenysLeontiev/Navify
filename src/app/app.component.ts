import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocationTrackerComponent } from "./components/location-tracker/location-tracker.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LocationTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Navify';
}
