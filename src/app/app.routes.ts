import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LocationTrackerComponent } from './components/location-tracker/location-tracker.component';
import { LastJourneyComponent } from './components/last-journey/last-journey.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'location-tracker', component: LocationTrackerComponent },
    { path: 'last-journey', component: LastJourneyComponent },
];
