import { Injectable } from '@angular/core';
import { Journey } from '../../models/journey';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private lastJourneyLocalStorageKey: string = "lastJourneyKey";

  private lastJourneySource: BehaviorSubject<Journey | null> = new BehaviorSubject<Journey | null>(this.getLastJourney());
  public lastJourney$: Observable<Journey | null> = this.lastJourneySource.asObservable();

  public getLastJourney(): Journey | null {
    let journeyStringified: string | null = localStorage.getItem(this.lastJourneyLocalStorageKey);

    let journey: Journey | null = journeyStringified 
      ? JSON.parse(journeyStringified) 
      : null;

    return journey;
  }

  public saveLastJourney(journey: Journey | null): void {
    this.lastJourneySource.next(journey);

    if (journey) {
      let journeyStringified: string = JSON.stringify(journey);
      localStorage.setItem(this.lastJourneyLocalStorageKey, journeyStringified);
    } else {
      localStorage.removeItem(this.lastJourneyLocalStorageKey);
    }
  }
}
