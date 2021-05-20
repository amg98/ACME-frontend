import { Component, OnInit } from "@angular/core";
import { TripsService } from "@services/trips.service";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { Router, ActivatedRoute } from "@angular/router";
import {TranslatorService} from "@services/translator.service";
import { Actor } from "src/app/models/Actor";
import {ActorsService} from "@services/actors.service";
import { FinderService } from "src/app/services/finder.service";
import { Trip } from "src/app/models/Trip";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";

const MAX_TRIPS = 10;

@Component({
    selector: "app-trip-list",
    templateUrl: "./trip-list.component.html",
    styleUrls: ["./trip-list.component.scss"]
})
export class TripListComponent extends TranslatableComponent implements OnInit {

 loggedActorName: string | null;
 loggedActorSub: Subscription;
 isAdmin = false;
 isManager = false;
 isExplorer = false;
 isSponsor = false;
 numObjects = MAX_TRIPS;


  actor!: Actor;
  data!: Trip[];
  roles!: string[];

  keyword!: string;
  minPrice!: string;
  maxPrice!: string;
  minDate!: string;
  maxDate!: string;
  cancelReason!: Trip["cancelReason"];
  close!: string;
  editTripText!:string;
  tripCanceledText!: string;
  tripDetailsText!: string;
  tripDeletedText!:string;
  tripCreatedText!:string;
  tripUpdatedText!:string;
  newTripText!: string;
  tripsListText!: string;
  finderSavedText!:string;

  showfilter = true;

  direction!: string;

  constructor(private tripService: TripsService, 
    public actorsService: ActorsService,
    private finderService: FinderService,
    translator: TranslatorService, 
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar) {
      super(translator);
      route.queryParams.subscribe(val => this.ngOnInit());

      this.loggedActorName = ""
        this.loggedActorSub = actorsService.subscribeToLoggedActor(loggedActor => {
            if(typeof loggedActor == "undefined") this.loggedActorName = ""
            else if(loggedActor == null) {
                this.loggedActorName = null
            } else {
                this.loggedActorName = `${loggedActor.name} ${loggedActor.surname}`
                this.isAdmin = loggedActor.roles.includes("ADMINISTRATOR")
                this.isManager = loggedActor.roles.includes("MANAGER")
                this.isExplorer = loggedActor.roles.includes("EXPLORER")
                this.isSponsor = loggedActor.roles.includes("SPONSOR")
            }
        })
      
      this.setLanguageChangeListener(() => {
          this.cancelReason = translator.getString("cancelReason");
          this.close = translator.getString("close");
          this.newTripText = translator.getString("newTrip");
          this.editTripText = translator.getString("tripDetailText");
          this.tripCanceledText = translator.getString("tripCanceledText");
          this.tripDetailsText = translator.getString("tripDetailsText");
          this.tripCanceledText = translator.getString("tripDeletedText");
          this.tripCreatedText = translator.getString("tripCreatedText");
          this.tripUpdatedText = translator.getString("tripUpdatedText");
          this.finderSavedText = translator.getString("finderSavedText");
      }); 
  }

  async ngOnInit() {
      console.log(this.route.url);
      if (this.route.url !== undefined) {
          /*this.route.url.subscribe(url => {
            if (url[0].path !== 'mytrips-created') {
              if (url[0].path !== 'finders') {
                this.route.queryParams
                .subscribe(async params => {
                  this.keyword = params['keyword'];
                  this.minDate = params['minDate'];
                  this.maxDate = params['maxDate'];
                  this.minPrice = params['minPrice'];
                  this.maxPrice = params['maxPrice'];
                  await this.searchTrips();
                });
              } else {
                this.finderService.getFinderUser(String(this.actor._id)).then(async params => {
                  /*this.keyword = params['keyword'];
                  this.minDate = params['minDate'];
                  this.maxDate = params['maxDate'];
                  this.minPrice = params['minPrice'];
                  this.maxPrice = params['maxPrice'];
                  await this.searchTrips();
                });
              }
                this.roles = [];
            } else {
              this.showfilter = false;
              this.actor = actor;
              this.tripService.getManagerTrips(String(this.actor._id)).then((val) => {
                this.data.push(val);
              });
            }
          });
      });
    } else {
      this.data = await this.tripService.getTrips()
    }*/
        this.data = await this.tripService.getAllTrips();
  }
}

  async searchTrips() {
      return this.tripService.searchTrips(0, MAX_TRIPS, this.keyword, this.minPrice, this.maxPrice,
          this.minDate, this.maxDate)
          .then((res) => {
              this.data = res;
          })
          .catch((err) => console.error(err.message));
  }

  getFirstPicture(trip: Trip) {
      if ( trip.pictures.length > 0) {
          if (trip.pictures[0] === "") {
              return "https://i.ya-webdesign.com/images/image-not-available-png-3.png";
          } else {
              return trip.pictures[0];
          }
      } else {
          return "https://i.ya-webdesign.com/images/image-not-available-png-3.png";
      }
  }

  searchFilter() {
      console.log(this.minPrice);
      this.router.navigate(["/trips/search"], { "queryParams": {
          "keyword": this.keyword,
          "minPrice": this.minPrice,
          "maxPrice": this.maxPrice,
          "minDate": this.minDate,
          "maxDate": this.maxDate
      }});
  }

  saveFinder() {
      if (this.actor != null && this.actor !== undefined) {
          this.finderService.updateFinderUser({
              "keyword": this.keyword,
              "minPrice": this.minPrice,
              "maxPrice": this.maxPrice,
              "minDate": this.minDate,
              "maxDate": this.maxDate
          }, String(this.actor._id))
              .then((val) => {
                  //this.messageService.notifyMessage(this.translateService.instant('messages.finder.saved'), 'alert alert-success');
              }, err => {
                  //this.messageService.notifyMessage(this.translateService.instant('errorMessages.500'), 'alert alert-danger');
              });
      }

  }

  //AÑADIR COMPROBACIÓN DE DIAS, CREO QUE ES UNA SEMANA ANTES DE QUE EMPIECE
  displayTrip(trip: Trip) {
      const date = new Date();
      const startDate = new Date(trip.startDate);
      return trip.isPublished && (startDate.getTime() > date.getTime());
  }

  // Functions to infinite scroll

  onScrollDown () {
      if (this.showfilter) {
          const start = this.numObjects;
          this.numObjects += MAX_TRIPS;
          this.appendTrips(start, this.numObjects);
          this.direction = "down";
      }
  }

  onScrollUp () {
      if (this.showfilter) {
          const start = this.numObjects;
          this.numObjects += MAX_TRIPS;
          this.prependTrips(start, this.numObjects);
          this.direction = "up";
      }
  }

  appendTrips (startIndex: number, endIndex: number) {
      this.addTrips(startIndex, endIndex, "push");
  }

  prependTrips (startIndex: number, endIndex: number) {
      this.addTrips(startIndex, endIndex, "unshift");
  }

  addTrips (startIndex: number, endIndex: number, _method: string) {
      this.tripService.searchTrips(startIndex, MAX_TRIPS, this.keyword, this.minPrice, this.maxPrice,
          this.minDate, this.maxDate)
          .then((val) => {
              this.data = this.data.concat(val);
          })
          .catch((err) => console.error(err.message));
  }

  showReasonCancel(trip: Trip) {
      this.snackbar.open(trip.cancelReason, this.close, {
          duration: 5000,
          panelClass: [ "alert-success" ]
      });
  }

  newTrip() {
      this.router.navigate(["trips/new"]);
  }

}