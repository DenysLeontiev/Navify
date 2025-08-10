import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../_services/localStorage/local-storage.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DurationPipe } from '../../_pipes/duration/duration.pipe';

@Component({
  selector: 'app-last-journey',
  standalone: true,
  imports: [CommonModule, TranslatePipe, DurationPipe],
  templateUrl: './last-journey.component.html',
  styleUrl: './last-journey.component.scss'
})

export class LastJourneyComponent {

  constructor(public localStorageService: LocalStorageService,
    public translate: TranslateService) { }

  public deleteLastJourney():void {
    this.localStorageService.deleteLastJourney();
  }
}
