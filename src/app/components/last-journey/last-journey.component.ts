import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DurationPipe } from '../../_pipes/duration/duration.pipe';
import { JourneyService } from '../../_services/journey/journey.service';

@Component({
  selector: 'app-last-journey',
  standalone: true,
  imports: [CommonModule, TranslatePipe, DurationPipe],
  templateUrl: './last-journey.component.html',
  styleUrl: './last-journey.component.scss'
})

export class LastJourneyComponent {

  constructor(public journeyService: JourneyService,
    public translate: TranslateService) { }

  public deleteLastJourney():void {
    this.journeyService.deleteLastJourney();
  }
}
