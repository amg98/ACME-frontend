import { Component, OnInit } from '@angular/core';
import { TranslatableComponent } from '@components/translatable/translatable.component';
import {TranslatorService} from '@services/translator.service';
import {Trip} from 'src/app/models/Trip';
import {TripService} from '@services/trip.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-trip-display',
  templateUrl: './trip-display.component.html',
  styleUrls: ['./trip-display.component.scss']
})
export class TripDisplayComponent extends TranslatableComponent implements OnInit {
  trip = new Trip();
  id: string;
  pictures: string[] = [];

  constructor(private tripService: TripService,
    private translatorService: TranslatorService,
    private router: Router,
    private route: ActivatedRoute) { 
      super(translatorService);
    }

  ngOnInit(): void {
    // Recover id param
    this.id = this.route.snapshot.params['id'];
    
    // Recover trip
    this.tripService.getTrip(this.id)
    .then((val) => {
      this.trip = val;
      console.log('trip detail: ' + this.trip.id)

    })
    .catch((err)=>{
      console.error(err);
    })

  }
  goBack(): void {
    this.router.navigate(['/']);
  }

}
