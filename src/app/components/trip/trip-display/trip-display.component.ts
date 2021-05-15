import { Component, OnInit } from '@angular/core';
import { TranslatableComponent } from '@components/translatable/translatable.component';
import {TranslatorService} from '@services/translator.service';
import {TripService} from '@services/trip.service';
import { Trip } from "src/app/models/Trip"
import { Router, ActivatedRoute } from '@angular/router';
import {ActorsService} from '@services/actors.service';
import { Actor } from "src/app/models/Actor";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-trip-display',
  templateUrl: './trip-display.component.html',
  styleUrls: ['./trip-display.component.scss']
})
export class TripDisplayComponent extends TranslatableComponent implements OnInit {
  
  trip!: Trip;
  _id!: string;
  pictures!: string[];
  sponsors!: string;
  actor!: Actor;
  applicationCreatedSuccessText!: string;
  applicationCreatedFailureText!:string;
  closeText!:string;


  constructor(private actorsService: ActorsService,
    private tripService: TripService,
    translator: TranslatorService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar) { 
      super(translator);

      this.setLanguageChangeListener(() => {
        this.applicationCreatedSuccessText = translator.getString("applicationCreatedSuccessText");
        this.applicationCreatedFailureText = translator.getString("applicationCreatedFailureText");
        this.closeText = translator.getString("close");
    });
    }

  async ngOnInit() {
    // Recover id param
    this._id = this.route.snapshot.params['id'];
    const param = this.route.snapshot.params['paramKey'];
    
    // Recover trip
    this.tripService.getTrip(this._id)
    .then((val) => {
      this.trip = val;
      console.log('trip detail: ' + this.trip._id)

    })
    .catch((err)=>{
      console.error(err);
    })

  }
  goBack(): void {
    this.router.navigate(['/']);
  }
  getPicture(id: number) {
    if ( this.trip.pictures.length > 0) {
      if (this.trip.pictures[id] === '') {
        return 'https://i.ya-webdesign.com/images/image-not-available-png-3.png';
      } else {
        return this.trip.pictures[id];
      }
    } else {
      return 'https://i.ya-webdesign.com/images/image-not-available-png-3.png';
    }
  }
  async onApply(tripId: string) {
    // console.log('idTrip: ' + idTrip);
    try{
      await this.actorsService.getCurrentActor().then( actor => {
        if (actor !== null) {
        // Se crea la aplicación
          this.tripService.applyTrip(tripId, actor._id)
          .then((appl) => {
            // console.log('appli detail: ' + appli);
            this.snackbar.open(this.applicationCreatedSuccessText, this.closeText, {
              duration: 5000,
              panelClass: [ "alert-success" ]
          });
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
          })
          .catch((err) => {
            console.error(err);
            console.error(err.status + ' - ' + err.error);
            const mes = err.status + ' - ' + err.error;
            // this.messageService.notifyMessage('application.appli.fail', 'alert alert-danger');
            //this.messageService.notifyMessage(mes, 'alert alert-danger');
          });

      } else {
        console.log('Error recuperar actor logado!');
      }
    });
    return true;
  }catch{
    this.snackbar.open(this.applicationCreatedFailureText, this.closeText, {
      duration: 5000,
      panelClass: [ "alert-error" ]
  });
  return false;
  }
}
}
