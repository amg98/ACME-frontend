import { Component, OnInit } from "@angular/core";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import {TranslatorService} from "@services/translator.service";
import {TripsService} from "@services/trips.service";
import { Router, ActivatedRoute } from "@angular/router";
import {ActorsService} from "@services/actors.service";
import { Actor } from "src/app/models/Actor";
import { MatSnackBar } from "@angular/material/snack-bar";
import {Trip} from "src/app/models/Trip";
import { Sponsorship } from "src/app/models/Sponsorship";
import { log } from "node:util";
import { truncate } from "node:fs";
import { Subscription } from "rxjs";

@Component({
    selector: "app-trip-display",
    templateUrl: "./trip-display.component.html",
    styleUrls: ["./trip-display.component.scss"]
})
export class TripDisplayComponent extends TranslatableComponent implements OnInit {
  
  loggedActorName: string | null;
  loggedActorSub: Subscription;
  isAdmin = false;
  isManager = false;
  isExplorer = false;
  isSponsor = false;

  trip!: Trip;
  id!: string;
  pictures!: string[];
  sponsors!: string;
  actor!: Actor
  tripDetailsText!: string;
  seeTripFromApplicationText!: string;
  applicationCreatedSuccessText!: string;
  applicationCreatedFailureText!:string;
  close!:string;
  back!:string;
  sponsorshipService: any;
  sponsorships: any;
  title!:string;
  ticker!: string;
  price!: string;
  description!: string;
  startDate!: string;
  endDate!: string;
  stages!: string;
  apply!: string;
  requirements!: string;
  sponsor!: string;


  constructor(public actorsService: ActorsService,
    private tripService: TripsService,
    translator: TranslatorService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar) { 
      super(translator);

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
          this.tripDetailsText = translator.getString("tripDetailsText");
          this.seeTripFromApplicationText = translator.getString("seeTripFromApplicationText");
          this.applicationCreatedSuccessText = translator.getString("applicationCreatedSuccessText");
          this.applicationCreatedFailureText = translator.getString("applicationCreatedFailureText");
          this.title = translator.getString("title");
          this.ticker = translator.getString("ticker");
          this.price = translator.getString("price");
          this.description = translator.getString("description");
          this.endDate = translator.getString("endDate");
          this.startDate = translator.getString("startDate");
          this.stages = translator.getString("stages");
          this.close = translator.getString("close");
          this.back = translator.getString("back");
          this.apply = translator.getString("apply");
          this.requirements = translator.getString("requirements");
          this.sponsor = translator.getString("sponsorText");
      });
  }

  async ngOnInit() {
      // Recover id param
      this.id = this.route.snapshot.params["id"];
      // console.log('id trip: ' + this.id);
      const param = this.route.snapshot.params["paramKey"];
      // console.log('param: ' + param);
  
      // si viene del boton ver trip del datatable de applications
      if (param === "application") {
          this.trip = await this.tripService.getTrip(this.id);
  
      } else {
          this.trip = await this.tripService.getTrip(this.id);
  
          /*if ( this.trip !== undefined && this.trip !== null ) {
              this.pictures = this.trip.pictures;
              this.sponsorships = this.sponsorshipService.getRandomSponsorForATrip(this.trip._id);   
          }  
          */
      }
  }
  
  
  goBack(): void {
      this.router.navigate(["/trips"]);
  }
  getPicture(n: number) {
      if ( this.trip.pictures.length > 0) {
          if (this.trip.pictures[n] === "") {
              return "https://i.ya-webdesign.com/images/image-not-available-png-3.png";
          } else {
              return this.trip.pictures[n];
          }
      } else {
          return "https://i.ya-webdesign.com/images/image-not-available-png-3.png";
      }
  }

  goSponsor(tripID:string){
    this.router.navigate(["/sponsorship-form"], { queryParams: { tripID: tripID}})
  }
  async onApply(tripId: string) {
      // console.log('idTrip: ' + idTrip);
      try{
        const loggedActor = this.actorsService.getLoggedActor()
    
              if (loggedActor !== null 
                && loggedActor !== undefined 
                && loggedActor._id !== undefined) {
                  // Se crea la aplicación
                  this.tripService.applyTrip(String(tripId), loggedActor._id)
                      .then(() => {
                          // console.log('appli detail: ' + appli);
                          this.snackbar.open(this.applicationCreatedSuccessText, this.close, {
                              duration: 5000,
                              panelClass: [ "alert-success" ]
                          });
                          document.body.scrollTop = 0; // For Safari
                          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                        })
                      .catch((err) => {
                          console.error(err);
                          this.snackbar.open(this.applicationCreatedFailureText, this.close, {
                            duration: 5000,
                            panelClass: [ "alert-error" ]
                        });
                      });
              } else {
                  console.log("Error recuperar actor logado!");
              }
              return true;
      }catch{
          this.snackbar.open(this.applicationCreatedFailureText, this.close, {
              duration: 5000,
              panelClass: [ "alert-error" ]
          });
          return false;
      }
  }
}
