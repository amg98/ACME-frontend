import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { ActorsService } from "@services/actors.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslatorService } from "@services/translator.service";
import {TripService} from "@services/trips.service";
import { Actor } from "src/app/models/Actor";
import { Trip } from "src/app/models/Trip";
import { ProfileComponent } from "@components/forms/profile/profile.component";

@Component({
    selector: "app-trip-form",
    templateUrl: "./trip-form.component.html",
    styleUrls: ["./trip-form.component.scss"]
})
export class TripFormComponent extends TranslatableComponent implements OnInit {
  actor!: Actor;
  tripForm!: FormGroup;
  stages!: FormArray;
  requeriments!: FormArray;
  pictures!: FormArray;
  trip!: Trip;
  isNew!: boolean;
  totalprice = 0;
  trip_new = true;
  updated!: boolean;
  profileForm!: FormGroup;
  tripCreationError!: string;
  closeText!: string;
  saveSuccessText!: string;
  saveFailureText!: string;
  newTripFormText!: string;
  title!: string;
  requiredFieldText!: string;
  description!: string;
  price!: string;
  saveText!: string;
  
  constructor(private formBuilder: FormBuilder,
      translator: TranslatorService,
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute, 
    private actorsService: ActorsService,
    private snackbar: MatSnackBar) {
      super(translator);

      this.setLanguageChangeListener(() => {
          this.closeText = translator.getString("close");
          this.saveSuccessText = translator.getString("save-success");
          this.saveFailureText = translator.getString("save-failure");
          this.newTripFormText = translator.getString("newTripFormText"); 
      });
  }
  ngOnInit() {
      this.updated = false;
      this.createForm();
      this.tripForm.controls["price"].setValue(this.totalprice);
      if (this.route.url !== undefined) {
          this.route.url.subscribe(url => {
              if (url[0].path !== "trips-new") {
                  this.trip_new = false;
                  this.route.params
                      .subscribe(async params => {
                          this.trip = await this.tripService.getTrip(params["id"]);
                          if (!this.actorsService.checkId(this.trip.manager)) {
                              this.router.navigate(["/denied-access"]);
                          } else {
                              this.tripForm.controls["title"].setValue(this.trip.title);
                              this.tripForm.controls["description"].setValue(this.trip.description);
                              this.totalprice = Number(this.trip.price);
                              this.tripForm.controls["price"].setValue(this.trip.price);
                              this.initRequeriments(this.trip.requeriments);
                              this.tripForm.controls["startDate"].setValue(this.formatDate(new Date(this.trip.startDate)));
                              this.tripForm.controls["endDate"].setValue(this.formatDate(new Date(this.trip.endDate)));
                              this.initPictures(this.trip.pictures);
                              this.initStages(this.trip.stages);
                          }
                      });
              }
          });
      }
      this.actorsService.getCurrentActor().then((actor) => {
          this.actor = actor;
          this.tripForm.controls["manager"].setValue(this.actor._id);
      });
  }

  getControls(frmGrp: FormGroup, key: string) {
      return (<FormArray>frmGrp.controls[key]).controls;
  }

  formatDate(d: Date) {
      let month = "" + (d.getMonth() + 1),
          day = "" + d.getDate();
        
      const year = d.getFullYear();

      if (month.length < 2) {month = "0" + month; }
      if (day.length < 2) {day = "0" + day; }

      return [year, month, day].join("-");
  }

  createForm() {
      this.tripForm = this.formBuilder.group({
          title: ["", Validators.required],
          description: ["", Validators.required],
          price: ["", Validators.required],
          requeriments: this.formBuilder.array([""]),
          startDate: ["", Validators.required],
          endDate: ["", Validators.required],
          pictures: this.formBuilder.array([""]),
          stages: this.formBuilder.array([this.createStage()]),
          manager: [""]
      });
  }

  updatePrice() {
      // Obtenemos los inputs de price de los stages y los recorremos para rellenar
      // El input de precio del trip
      const stages_price = document.getElementsByClassName("price-stage");
      this.totalprice = 0;
      for (let i = 0; i < stages_price.length; i++) {
          const stage = <HTMLInputElement>stages_price[i];
          this.totalprice += Number(stage.value);
      }
      this.tripForm.controls["price"].setValue(this.totalprice);
  }

  createStage() {
      return this.formBuilder.group({
          title: [""],
          description: [""],
          price: [""]
      });
  }

  removeStage(index: number) {
      this.stages.removeAt(index);
      this.updatePrice();
  }

  addStage() {
      this.stages = this.tripForm.get("stages") as FormArray;
      this.stages.push(this.createStage());
  }

  initStages(stagesList: any[]) {
      this.stages = this.tripForm.get("stages") as FormArray;
      stagesList.map(item => {
          this.stages.push(this.formBuilder.group(
              {
                  title: [item.title],
                  description: [item.description],
                  price: [item.price]
              }));
      });
      this.removeStage(0);
      this.tripForm.setControl("stages", this.stages);
  }

  addRequeriments() {
      this.requeriments = this.tripForm.get("requeriments") as FormArray;
      this.requeriments.push(new FormControl([""]));
  }

  removeReq(index: number) {
      this.requeriments.removeAt(index);
  }

  initRequeriments(requerimentsList: string[]) {
      this.requeriments = this.tripForm.get("requeriments") as FormArray;
      requerimentsList.map(item => {
          this.requeriments.push(new FormControl(item));
      });
      this.removeReq(0);
      this.tripForm.setControl("requeriments", this.requeriments);
  }

  addPicture() {
      this.pictures = this.tripForm.get("pictures") as FormArray;
      this.pictures.push(new FormControl([""]));
  }

  removePic(index: number) {
      this.pictures.removeAt(index);
  }

  initPictures(picturesList: string[]) {
      this.pictures = this.tripForm.get("pictures") as FormArray;
      picturesList.map(item => {
          this.pictures.push(new FormControl(item));
      });
      this.removePic(0);
      this.tripForm.setControl("pictures", this.pictures);
  }
  onSubmit() {
      const formTrip = this.tripForm.value;
      if (this.trip_new) {
          this.tripService.postTrip(formTrip).then( val => {
              this.updated = true;
              this.router.navigate(["/trips-created"]);
              // TODO : poner mensaje creado
          }, err => {
              this.snackbar.open(this.saveFailureText, this.closeText, {
                  duration: 5000,
                  panelClass: [ "alert-error" ]

              });
          }
          );
      } else {
          this.tripService.updateTrip(formTrip, this.trip.ticker).then( val => {
              this.updated = true;
              this.router.navigate(["/trips-created"]);
              this.snackbar.open(this.saveSuccessText, this.closeText, {
                  duration: 5000,
                  panelClass: [ "alert-success" ]
              });
          }, err => {
              this.snackbar.open(this.saveFailureText, this.closeText, {
                  duration: 5000,
                  panelClass: [ "alert-error" ]
              });
          }
          );
      }
  }

  goBack() {
      window.history.back();
  }

}


