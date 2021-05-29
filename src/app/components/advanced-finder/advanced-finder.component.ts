import { Component, OnInit } from '@angular/core';
import { TripsService } from "@services/trips.service"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { Router, ActivatedRoute } from "@angular/router"
import { TranslatorService } from "@services/translator.service"
import { Actor } from "src/app/models/Actor"
import { ActorsService } from "@services/actors.service"
import { FinderService } from "src/app/services/finder.service"
import { Trip } from "src/app/models/Trip"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Subscription } from "rxjs"

const MAX_TRIPS = 10

@Component({
  selector: 'app-advanced-finder',
  templateUrl: './advanced-finder.component.html',
  styleUrls: ['./advanced-finder.component.scss']
})

export class AdvancedfinderComponent extends TranslatableComponent implements OnInit {

  isExplorer = false;
  numObjects = MAX_TRIPS;


  actor!: Actor;
  data!: Trip[];
  roles!: string[];

  keyword!: string;
  minPrice!: string;
  maxPrice!: string;
  minDate!: string;
  maxDate!: string;

  showfilter = true;



  loggedActorName: string | null;
  loggedActorSub: Subscription;

  direction!: string;

  constructor(private tripService: TripsService,
    public actorsService: ActorsService,
    private finderService: FinderService,
    translator: TranslatorService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) {
    super(translator)
    route.queryParams.subscribe(val => this.ngOnInit())

    this.tripService.subscribeToSearchResults(trips => {
      if (trips == null) return
      this.data = trips
    })

    this.loggedActorName = ""
    this.loggedActorSub = actorsService.subscribeToLoggedActor(loggedActor => {
      if (typeof loggedActor == "undefined") this.loggedActorName = ""
      else if (loggedActor == null) {
        this.loggedActorName = null
      } else {
        this.loggedActorName = `${loggedActor.name} ${loggedActor.surname}`

        this.isExplorer = loggedActor.roles.includes("EXPLORER")
      }
    })
  }

  async ngOnInit() {
    console.log(this.route.url);
    if (this.route.url !== undefined) {
      this.actor = this.actor;
      this.route.url.subscribe(url => {
        if (url[0].path !== 'trips') {
          this.router.navigate(["trips"])
            this.route.queryParams
              .subscribe(async params => {
                this.keyword = params['keyword'];
                this.minDate = params['minDate'];
                this.maxDate = params['maxDate'];
                this.minPrice = params['minPrice'];
                this.maxPrice = params['maxPrice'];
                await this.searchTrips();
              });
        }
      });
    } else {
      console.log('test');
      await this.searchTrips();
    }
  }

  saveFinder() {
    if (this.actor._id != null && this.actor._id !== undefined) {
      this.finderService.updateFinderUser({
        'keyword': this.keyword,
        'minPrice': this.minPrice,
        'maxPrice': this.maxPrice,
        'minDate': this.minDate,
        'maxDate': this.maxDate
      }, this.actor._id)
        .then((val) => {
          //this.messageService.notifyMessage(this.translateService.instant('messages.finder.saved'), 'alert alert-success');
        }, err => {
          //this.messageService.notifyMessage(this.translateService.instant('errorMessages.500'), 'alert alert-danger');
        });
    }

  }


  async searchTrips() {
    return this.tripService.searchTrips(0, 10, this.keyword, this.minPrice, this.maxPrice,
      this.minDate, this.maxDate)
      .then((val) => {
        this.data = val;
      })
      .catch((err) => console.error(err.message));
  }

}
